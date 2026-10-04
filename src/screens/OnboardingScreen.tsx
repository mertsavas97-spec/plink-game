import React, { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { IconArrowBack, IconArrowDown, IconSparkles } from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { TapHand } from '../components/TapHand';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const STEPS = [
  {
    id: 'select',
    eyebrow: '01 — SELECT',
    title: 'Find matching colors',
    body: 'Tap a group of two or more connected tiles of the same color.',
  },
  {
    id: 'clear',
    eyebrow: '02 — CLEAR',
    title: 'Clear the board',
    body: 'Tiles fall down and empty columns disappear. Plan your next move.',
  },
  {
    id: 'master',
    eyebrow: '03 — MASTER',
    title: 'Think big. Score big.',
    body: 'Create larger groups, play faster and aim for a new high score.',
  },
] as const;

const DEMO_BOARDS: TileColorId[][][] = [
  [
    ['A', 'B', 'D', 'E'],
    ['B', 'D', 'D', 'A'],
    ['A', 'D', 'D', 'E'],
    ['E', 'B', 'A', 'C'],
  ],
  [
    ['A', 'B', 'E', 'D'],
    ['A', 'C', 'C', 'B'],
    ['D', 'C', 'C', 'A'],
    ['E', 'B', 'A', 'D'],
  ],
  [
    ['A', 'B', 'C', 'E'],
    ['B', 'C', 'C', 'D'],
    ['A', 'C', 'C', 'B'],
    ['E', 'D', 'A', 'B'],
  ],
];

const SELECTED: Array<Set<string>> = [
  new Set(['1,1', '2,1', '1,2', '2,2']),
  new Set(['1,1', '2,1', '1,2', '2,2']),
  new Set(['1,1', '2,1', '1,2', '2,2']),
];

function DemoBoard({
  board,
  selected,
  showHand,
  parallax,
  tileSize,
}: {
  board: TileColorId[][];
  selected: Set<string>;
  showHand?: boolean;
  parallax: Animated.AnimatedInterpolation<number>;
  tileSize: number;
}) {
  // Bottom-right of highlighted cluster tile (col 2, row 2) — not the board corner
  const pitch = tileSize * (1 + layout.tileGapRatio);
  const handInset = layout.boardPad + pitch + tileSize * 0.2;
  return (
    <Animated.View
      style={[
        styles.illustrationInner,
        { transform: [{ translateX: parallax }] },
      ]}
    >
      <View style={styles.demoGrid}>
        {board.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={tileSize}
                showLetter
                selected={selected.has(`${c},${r}`)}
              />
            ))}
          </View>
        ))}
        {showHand ? <TapHand right={handInset} bottom={handInset} /> : null}
      </View>
    </Animated.View>
  );
}

function ClearExtras() {
  const drop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const native = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drop, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: native,
        }),
        Animated.timing(drop, { toValue: 0, duration: 0, useNativeDriver: native }),
        Animated.delay(400),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drop]);
  const y = drop.interpolate({ inputRange: [0, 1], outputRange: [-8, 10] });
  return (
    <View style={styles.extraRow}>
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <IconArrowDown size={22} color={colors.cream} />
      </Animated.View>
      <IconArrowBack size={20} color={colors.cream} />
    </View>
  );
}

function MasterExtras() {
  return (
    <View style={styles.extraRow}>
      <IconSparkles size={18} color={colors.gold} />
      <Text style={styles.popLabel}>POP · +49</Text>
      <IconSparkles size={16} color={colors.tile.A} />
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const { completeOnboarding } = useApp();
  const { width: pageW } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const listRef = useRef<FlatList<(typeof STEPS)[number]>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const isLast = step === STEPS.length - 1;

  const tileSize = useMemo(() => {
    const targetW = pageW * layout.onboardingIllustrationWidthRatio;
    const cols = layout.onboardingDemoCols;
    const gapRatio = layout.tileGapRatio;
    const pad = layout.boardPad * 2;
    const inner = targetW - pad;
    const pitch = inner / cols;
    return Math.max(36, Math.floor(pitch / (1 + gapRatio)));
  }, [pageW]);

  const illustrationH = useMemo(() => {
    const cols = layout.onboardingDemoCols;
    const gap = Math.round(tileSize * layout.tileGapRatio);
    const boardH = cols * (tileSize + gap) + layout.boardPad * 2;
    return boardH + 40; // room for extras under board
  }, [tileSize]);

  const finish = async () => {
    await completeOnboarding();
    navigation.replace('MainMenu');
  };

  const next = () => {
    if (isLast) void finish();
    else listRef.current?.scrollToIndex({ index: step + 1, animated: true });
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const idx = viewableItems[0]?.index;
      if (typeof idx === 'number') setStep(idx);
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: Platform.OS !== 'web' },
  );

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof STEPS)[number]; index: number }) => {
      const parallax = scrollX.interpolate({
        inputRange: [(index - 1) * pageW, index * pageW, (index + 1) * pageW],
        outputRange: [24, 0, -24],
        extrapolate: 'clamp',
      });
      return (
        <View style={[styles.page, { width: pageW }]}>
          <View style={styles.copyBlock}>
            <View style={styles.slotLabel}>
              <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            </View>
            <View style={styles.slotTitle}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.slotBody}>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>

          <View style={[styles.slotIllustration, { height: illustrationH }]}>
            <DemoBoard
              board={DEMO_BOARDS[index]}
              selected={SELECTED[index]}
              showHand={index === 0}
              parallax={parallax}
              tileSize={tileSize}
            />
            {index === 1 ? <ClearExtras /> : null}
            {index === 2 ? <MasterExtras /> : null}
          </View>
        </View>
      );
    },
    [scrollX, pageW, tileSize, illustrationH],
  );

  return (
    <ScreenBackground decorPreset="onboarding">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <Animated.FlatList
          ref={listRef as RefObject<FlatList<(typeof STEPS)[number]>>}
          data={[...STEPS]}
          keyExtractor={(s) => s.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({
            length: pageW,
            offset: pageW * index,
            index,
          })}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / pageW);
            setStep(idx);
          }}
          style={styles.pager}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View key={s.id} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <AppButton
            label={isLast ? 'Get Started' : 'Next'}
            onPress={next}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pager: { flex: 1 },
  page: {
    paddingHorizontal: layout.screenPad,
    paddingTop: layout.onboardingTopPad,
    flex: 1,
    justifyContent: 'center',
  },
  copyBlock: {
    alignItems: 'center',
    zIndex: 2,
  },
  slotLabel: {
    height: 24,
    justifyContent: 'center',
    marginBottom: 8,
  },
  slotTitle: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
  },
  slotBody: {
    height: 52,
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  slotIllustration: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationInner: {
    alignItems: 'center',
  },
  eyebrow: {
    ...typeScale.label,
    color: colors.cream,
    textAlign: 'center',
  },
  title: {
    ...typeScale.title,
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    ...typeScale.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  demoGrid: {
    backgroundColor: colors.surface,
    padding: layout.boardPad,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoRow: { flexDirection: 'row' },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    height: 28,
  },
  popLabel: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  footer: {
    paddingHorizontal: layout.screenPad,
    paddingBottom: 16,
    gap: 14,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.cream, width: 22 },
});
