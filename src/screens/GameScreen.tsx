import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BoardView } from '../components/BoardView';
import {
  IconClose,
  IconHint,
  IconPause,
  IconRedo,
  IconSettings,
  IconUndo,
} from '../components/Icons';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';
import { BOARD_PRESETS, GameEngine, clusterScore, type Position } from '../engine';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function toKeySet(positions: Position[] | null | undefined): Set<string> {
  const set = new Set<string>();
  if (!positions) return set;
  for (const p of positions) set.add(`${p.col},${p.row}`);
  return set;
}

export function GameScreen({ navigation, route }: Props) {
  const { colorCount, boardPreset } = route.params;
  const { settings, highScore, recordScore } = useApp();
  const resolvedPreset =
    boardPreset in BOARD_PRESETS ? boardPreset : ('8x8' as const);

  const engineRef = useRef(
    new GameEngine(
      {
        colorCount,
        boardSize: BOARD_PRESETS[resolvedPreset],
      },
      Date.now(),
      settings.undoLimit,
    ),
  );

  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<Position[] | null>(null);
  const [hint, setHint] = useState<Position[] | null>(null);
  const [paused, setPaused] = useState(false);
  const endingRef = useRef(false);

  const bump = useCallback(() => setTick((t) => t + 1), []);

  const engine = engineRef.current;
  const snap = useMemo(() => {
    void tick;
    return engine.getSnapshot();
  }, [engine, tick]);

  useEffect(() => {
    engine.setUndoLimit(settings.undoLimit);
  }, [engine, settings.undoLimit]);

  useEffect(() => {
    if (paused || snap.status !== 'playing') return;
    const id = setInterval(() => bump(), 1000);
    return () => clearInterval(id);
  }, [paused, snap.status, bump]);

  const finishIfNeeded = useCallback(async () => {
    const status = engine.getStatus();
    if (status === 'playing' || endingRef.current) return;
    endingRef.current = true;
    const score = engine.getScore();
    const isNewHigh = await recordScore(score);
    navigation.replace('GameOver', {
      score,
      best: Math.max(highScore, score),
      isNewHigh,
      won: status === 'won',
      colorCount,
      boardPreset: resolvedPreset,
    });
  }, [engine, recordScore, highScore, navigation, colorCount, resolvedPreset]);

  useEffect(() => {
    if (snap.status !== 'playing') {
      void finishIfNeeded();
    }
  }, [snap.status, finishIfNeeded]);

  const onTilePress = (pos: Position) => {
    if (paused || engine.getStatus() !== 'playing') return;
    setHint(null);
    const cluster = engine.select(pos);
    if (!cluster) {
      setSelected(null);
      return;
    }
    const key = `${pos.col},${pos.row}`;
    const already =
      selected != null && selected.some((p) => `${p.col},${p.row}` === key);
    if (already) {
      engine.clearCluster(cluster);
      setSelected(null);
      bump();
      return;
    }
    setSelected(cluster);
  };

  const onPause = () => {
    engine.pause();
    setPaused(true);
    bump();
  };

  const onResume = () => {
    engine.resume();
    setPaused(false);
    bump();
  };

  const onRestart = () => {
    engineRef.current = new GameEngine(
      {
        colorCount,
        boardSize: BOARD_PRESETS[resolvedPreset],
      },
      Date.now(),
      settings.undoLimit,
    );
    endingRef.current = false;
    setSelected(null);
    setHint(null);
    setPaused(false);
    bump();
  };

  const exitToMenu = () => {
    navigation.popToTop();
  };

  const onUndo = () => {
    if (engine.undo()) {
      setSelected(null);
      setHint(null);
      bump();
    }
  };

  const onRedo = () => {
    if (engine.redo()) {
      setSelected(null);
      setHint(null);
      bump();
    }
  };

  const onHint = () => {
    setHint(engine.getHint());
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={exitToMenu} style={styles.iconBtn} accessibilityLabel="Exit">
          <IconClose />
        </Pressable>
        <View style={styles.scoreCenter}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.score}>{formatScore(snap.score)}</Text>
          <Text style={styles.timer}>{formatTime(snap.elapsedMs)}</Text>
        </View>
        <Pressable onPress={onPause} style={styles.iconBtn} accessibilityLabel="Pause">
          <IconPause />
        </Pressable>
      </View>

      <View style={styles.boardWrap}>
        <BoardView
          board={snap.board}
          selected={toKeySet(selected)}
          hintKeys={toKeySet(hint)}
          showLetters={settings.showTileLetters}
          onTilePress={onTilePress}
        />
        {selected && selected.length > 2 ? (
          <Text style={styles.preview}>
            Clear {selected.length} → +{formatScore(clusterScore(selected.length, colorCount))}
          </Text>
        ) : selected && selected.length === 2 ? (
          <Text style={styles.previewMuted}>Size 2 clears but scores 0</Text>
        ) : (
          <Text style={styles.previewMuted}>Tap a group, tap again to clear</Text>
        )}
      </View>

      <View style={styles.controls}>
        <IconControl label="Undo" disabled={!engine.canUndo()} onPress={onUndo}>
          <IconUndo color={engine.canUndo() ? colors.text : colors.textMuted} />
        </IconControl>
        <IconControl label="Redo" disabled={!engine.canRedo()} onPress={onRedo}>
          <IconRedo color={engine.canRedo() ? colors.text : colors.textMuted} />
        </IconControl>
        <IconControl label="Hint" onPress={onHint}>
          <IconHint color={colors.cream} />
        </IconControl>
      </View>

      {paused ? (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.pausedTitle}>Paused</Text>
            <PillButton label="Resume" variant="primary" onPress={onResume} />
            <PillButton label="Restart" variant="secondary" onPress={onRestart} />
            <PillButton
              label="Settings"
              variant="secondary"
              icon={<IconSettings size={18} />}
              onPress={() => navigation.navigate('Settings')}
            />
            <PillButton label="Main Menu" variant="ghost" onPress={exitToMenu} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function IconControl({
  label,
  onPress,
  disabled,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[styles.controlBtn, disabled && styles.controlDisabled]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 6,
    minHeight: 56,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCenter: { alignItems: 'center' },
  scoreLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  score: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  timer: {
    fontFamily: fonts.bold,
    color: colors.cream,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  boardWrap: { flex: 1, justifyContent: 'center', gap: 12, paddingHorizontal: 4 },
  preview: {
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: colors.cream,
    fontSize: 14,
    fontWeight: '700',
  },
  previewMuted: {
    fontFamily: fonts.regular,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    paddingBottom: 16,
    paddingTop: 4,
    paddingHorizontal: 20,
    minHeight: 72,
  },
  controlBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlDisabled: { opacity: 0.35 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 26,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pausedTitle: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
});
