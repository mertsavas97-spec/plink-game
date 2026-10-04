import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BoardView } from '../components/BoardView';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';
import { BOARD_PRESETS, GameEngine, clusterScore, type Position } from '../engine';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

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

  const engineRef = useRef(
    new GameEngine({
      colorCount,
      boardSize: BOARD_PRESETS[boardPreset],
    }),
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
      boardPreset,
    });
  }, [engine, recordScore, highScore, navigation, colorCount, boardPreset]);

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
    engineRef.current = new GameEngine({
      colorCount,
      boardSize: BOARD_PRESETS[boardPreset],
    });
    endingRef.current = false;
    setSelected(null);
    setHint(null);
    setPaused(false);
    bump();
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.score}>{formatScore(snap.score)}</Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timer}>{formatTime(snap.elapsedMs)}</Text>
        </View>
        <Pressable onPress={onPause} style={styles.pauseBtn} accessibilityLabel="Pause">
          <Text style={styles.pauseIcon}>❚❚</Text>
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
        <ControlButton label="Undo" disabled={!engine.canUndo()} onPress={onUndo} />
        <ControlButton label="Redo" disabled={!engine.canRedo()} onPress={onRedo} />
        <ControlButton label="Hint" onPress={onHint} />
      </View>

      {paused ? (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.pausedTitle}>Paused</Text>
            <PillButton label="Resume" variant="mint" onPress={onResume} />
            <PillButton label="Restart" variant="secondary" onPress={onRestart} />
            <PillButton
              label="Settings"
              variant="secondary"
              onPress={() => navigation.navigate('Settings')}
            />
            <PillButton
              label="Main Menu"
              variant="ghost"
              onPress={() => navigation.popToTop()}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ControlButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.controlBtn, disabled && styles.controlDisabled]}
    >
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  scoreLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  score: { color: colors.text, fontSize: 28, fontWeight: '800' },
  timerBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  timer: { color: colors.cream, fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIcon: { color: colors.text, fontSize: 14, fontWeight: '700' },
  boardWrap: { flex: 1, justifyContent: 'center', gap: 10 },
  preview: {
    textAlign: 'center',
    color: colors.mint,
    fontSize: 14,
    fontWeight: '700',
  },
  previewMuted: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  controlBtn: {
    minWidth: 88,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  controlDisabled: { opacity: 0.35 },
  controlLabel: { color: colors.text, fontWeight: '700', fontSize: 14 },
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
    borderRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pausedTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
});
