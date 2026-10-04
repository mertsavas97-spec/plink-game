import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { BoardView } from '../components/BoardView';
import { GameBackground } from '../components/GameBackground';
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
import { useApp } from '../context/AppContext';
import {
  BOARD_PRESETS,
  GameEngine,
  hasValidMoves,
  type BoardPreset,
  type Position,
} from '../engine';
import type { RootStackParamList } from '../navigation/types';
import { resolvePlayablePreset } from '../theme/boardLayout';
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
  const { colorCount, boardPreset, daily, seed } = route.params;
  const { settings, highScore, recordScore, applyGameStats } = useApp();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => sub.remove();
  }, []);

  const requested: BoardPreset =
    boardPreset in BOARD_PRESETS ? boardPreset : '10x14';

  const topChrome = insets.top + layout.chromeTop + layout.hudBoardGap;
  const bottomChrome = insets.bottom + layout.chromeBottom;

  const resolvedPreset = useMemo(() => {
    const { preset, fellBack } = resolvePlayablePreset(
      requested,
      screenW,
      screenH,
      topChrome,
      bottomChrome,
    );
    if (fellBack && typeof __DEV__ !== 'undefined' && __DEV__) {
      console.info(
        `[Board] ${requested} < ${layout.minTile}pt → using ${preset}`,
      );
    }
    return preset;
  }, [requested, screenW, screenH, topChrome, bottomChrome]);

  const engineRef = useRef(
    new GameEngine(
      {
        colorCount,
        boardSize: BOARD_PRESETS[resolvedPreset],
        seed,
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
  const tilesClearedRef = useRef(0);
  const undosUsedRef = useRef(0);

  const reactionStrength = useSharedValue(0);
  const [reactionColor, setReactionColor] = useState<string>(colors.tile.A);

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
    await applyGameStats({
      score,
      tilesCleared: tilesClearedRef.current,
      elapsedMs: engine.getElapsedMs(),
      undosUsed: undosUsedRef.current,
      won: status === 'won',
      daily: !!daily,
    });
    navigation.replace('GameOver', {
      score,
      best: isNewHigh ? score : previousBest,
      isNewHigh,
      won: status === 'won',
      colorCount,
      boardPreset: resolvedPreset,
      daily,
    });
  }, [
    engine,
    recordScore,
    applyGameStats,
    highScore,
    navigation,
    colorCount,
    resolvedPreset,
    daily,
  ]);

  useEffect(() => {
    if (snap.status !== 'playing') {
      void finishIfNeeded();
    }
  }, [snap.status, finishIfNeeded]);

  const triggerClearReaction = useCallback(
    (cluster: Position[]) => {
      if (reduceMotion || cluster.length === 0) return;
      const cell = engine.getBoard()[cluster[0].col]?.[cluster[0].row];
      if (cell) setReactionColor(colors.tile[cell]);
      const boost = Math.min(0.14, 0.06 + cluster.length * 0.006);
      reactionStrength.value = withSequence(
        withTiming(boost, { duration: 200 }),
        withTiming(0, { duration: 700 }),
      );
    },
    [engine, reactionStrength, reduceMotion],
  );

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
      tilesClearedRef.current += cluster.length;
      triggerClearReaction(cluster);
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
        seed,
      },
      Date.now(),
      settings.undoLimit,
    );
    endingRef.current = false;
    tilesClearedRef.current = 0;
    undosUsedRef.current = 0;
    setSelected(null);
    setHint(null);
    setPaused(false);
    reactionStrength.value = 0;
    bump();
  };

  const exitToMenu = () => {
    navigation.popToTop();
  };

  const onUndo = () => {
    if (engine.undo()) {
      undosUsedRef.current += 1;
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

  const canUndo = engine.canUndo();
  const canRedo = engine.canRedo();
  const hintReady = hasValidMoves(snap.board);

  return (
    <GameBackground
      reduceMotion={reduceMotion}
      clearReaction={{ strength: reactionStrength, color: reactionColor }}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Playfield: HUD + board as one vertically centered unit */}
        <View
          style={[
            styles.playfield,
            { paddingBottom: layout.dockHeight + insets.bottom + 12 },
          ]}
        >
          <View style={styles.unit}>
            <View style={styles.hud}>
              <View style={styles.sideSlot} />
              <View style={styles.scoreCenter}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={styles.score}>{formatScore(snap.score)}</Text>
              </View>
              <Pressable
                onPress={onPause}
                style={styles.pauseBtn}
                accessibilityLabel="Pause"
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
                  style={styles.pauseFill}
                >
                  <IconPause size={20} />
                </LinearGradient>
              </Pressable>
            </View>

            <View style={{ height: layout.hudBoardGap }} />

            <BoardView
              board={snap.board}
              selected={toKeySet(selected)}
              hintKeys={toKeySet(hint)}
              showLetters={settings.showTileLetters}
              onTilePress={onTilePress}
              topChrome={topChrome}
              bottomChrome={bottomChrome}
            />
          </View>
        </View>

        {/* Glass bottom dock */}
        <View
          style={[
            styles.dockWrap,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.dockBorder}
          >
            <LinearGradient
              colors={['rgba(17,27,46,0.92)', 'rgba(11,18,32,0.96)']}
              style={styles.dock}
            >
              <DockButton
                label="Undo"
                disabled={!canUndo}
                onPress={onUndo}
              >
                <IconUndo
                  size={24}
                  color={canUndo ? colors.text : colors.textMuted}
                />
              </DockButton>
              <DockButton
                label="Redo"
                disabled={!canRedo}
                onPress={onRedo}
              >
                <IconRedo
                  size={24}
                  color={canRedo ? colors.text : colors.textMuted}
                />
              </DockButton>
              <DockButton
                label="Hint"
                onPress={onHint}
                hintReady={hintReady}
              >
                <IconHint
                  size={24}
                  color={hintReady ? colors.accent : colors.textMuted}
                />
              </DockButton>
            </LinearGradient>
          </LinearGradient>
        </View>

        {paused ? (
          <View style={styles.overlay}>
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
    </GameBackground>
  );
}

function DockButton({
  label,
  onPress,
  disabled,
  hintReady,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  hintReady?: boolean;
  children: ReactNode;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 80 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      style={styles.dockBtnHit}
    >
      <Animated.View
        style={[
          styles.dockBtn,
          disabled && styles.dockBtnDisabled,
          hintReady && styles.dockBtnHint,
          anim,
        ]}
      >
        {children}
      </Animated.View>
      <Text style={[styles.dockLabel, disabled && styles.dockLabelDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  playfield: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.boardScreenMargin,
  },
  unit: {
    alignItems: 'center',
    width: '100%',
  },
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    minHeight: layout.pauseBtnSize,
  },
  sideSlot: { width: layout.pauseBtnSize },
  scoreCenter: { alignItems: 'center', flex: 1 },
  scoreLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '600',
    color: colors.textMuted,
  },
  score: {
    ...typeScale.score,
    color: colors.text,
    textShadowColor: 'rgba(255,255,255,0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  pauseBtn: {
    width: layout.pauseBtnSize,
    height: layout.pauseBtnSize,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  pauseFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,27,46,0.85)',
  },
  dockWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.dockSideMargin,
    zIndex: 5,
  },
  dockBorder: {
    borderRadius: layout.dockRadius,
    padding: 1,
  },
  dock: {
    height: layout.dockHeight,
    borderRadius: layout.dockRadius - 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dockBtnHit: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 72,
  },
  dockBtn: {
    width: layout.dockBtnSize,
    height: layout.dockBtnSize,
    borderRadius: layout.dockBtnSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  dockBtnDisabled: {
    opacity: 0.45,
  },
  dockBtnHint: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  dockLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  dockLabelDisabled: {
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 20,
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
