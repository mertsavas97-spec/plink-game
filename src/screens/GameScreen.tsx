import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { BoardView } from '../components/BoardView';
import {
  IconHint,
  IconHome,
  IconPause,
  IconPlay,
  IconRedo,
  IconRestart,
  IconSettings,
  IconUndo,
} from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import { BOARD_PRESETS, GameEngine, clusterScore, type Position } from '../engine';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
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
    boardPreset in BOARD_PRESETS ? boardPreset : ('12x14' as const);

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

  const finishIfNeeded = useCallback(async () => {
    const status = engine.getStatus();
    if (status === 'playing' || endingRef.current) return;
    endingRef.current = true;
    const score = engine.getScore();
    const previousBest = highScore;
    const isNewHigh = await recordScore(score);
    navigation.replace('GameOver', {
      score,
      best: isNewHigh ? score : previousBest,
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
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.topBar}>
          <View style={styles.sideSlot} />
          <View style={styles.scoreCenter}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.score}>{formatScore(snap.score)}</Text>
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
          ) : null}
        </View>

        <View style={styles.controls}>
          <IconControl
            label="Undo"
            disabled={!engine.canUndo()}
            onPress={onUndo}
          >
            <IconUndo color={engine.canUndo() ? colors.text : colors.textMuted} />
          </IconControl>
          <IconControl
            label="Redo"
            disabled={!engine.canRedo()}
            onPress={onRedo}
          >
            <IconRedo color={engine.canRedo() ? colors.text : colors.textMuted} />
          </IconControl>
          <IconControl label="Hint" onPress={onHint}>
            <IconHint color={colors.cream} />
          </IconControl>
        </View>

        {paused ? (
          <View style={styles.overlay}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.dim} />
            <View style={styles.modal}>
              <Text style={styles.pausedTitle}>Paused</Text>
              <AppButton
                label="Resume"
                variant="primary"
                icon={<IconPlay size={18} color={colors.textDark} />}
                onPress={onResume}
              />
              <AppButton
                label="Restart"
                variant="secondary"
                icon={<IconRestart />}
                onPress={onRestart}
              />
              <AppButton
                label="Settings"
                variant="secondary"
                icon={<IconSettings size={18} />}
                onPress={() => navigation.navigate('Settings')}
              />
              <AppButton
                label="Main Menu"
                variant="ghost"
                icon={<IconHome />}
                onPress={exitToMenu}
              />
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </ScreenBackground>
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
      <Text style={[styles.controlLabel, disabled && styles.controlLabelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPad,
    paddingTop: 2,
    paddingBottom: 6,
    minHeight: layout.chromeTop,
  },
  sideSlot: { width: layout.iconBtn },
  iconBtn: {
    width: layout.iconBtn,
    height: layout.iconBtn,
    minWidth: layout.iconBtn,
    minHeight: layout.iconBtn,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCenter: { alignItems: 'center', flex: 1 },
  scoreLabel: {
    ...typeScale.label,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  score: {
    ...typeScale.score,
    color: colors.text,
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
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
    gap: 22,
    paddingBottom: 14,
    paddingTop: 4,
    paddingHorizontal: layout.screenPad,
    minHeight: layout.chromeBottom,
  },
  controlBtn: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  controlDisabled: { opacity: 0.35 },
  controlLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: layout.controlLabelSize,
    fontWeight: '600',
  },
  controlLabelDisabled: { color: colors.textMuted },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  modal: {
    width: '100%',
    maxWidth: layout.modalMaxWidth,
    backgroundColor: colors.surface,
    borderRadius: layout.modalRadius,
    padding: layout.modalPad,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  pausedTitle: {
    ...typeScale.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
});
