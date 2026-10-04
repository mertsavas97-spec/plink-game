import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  IconArrowBack,
  IconArrowDown,
  IconHand,
  IconSparkles,
} from '../components/Icons';
import { AppButton } from '../components/AppButton';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

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

const SELECT_DEMO: TileColorId[][] = [
  ['A', 'B', 'D', 'E'],
  ['B', 'D', 'D', 'A'],
  ['A', 'D', 'D', 'E'],
  ['E', 'B', 'A', 'C'],
];
const SELECTED_D = new Set(['1,1', '2,1', '1,2', '2,2']);

function SelectDemo() {
  return (
    <View style={styles.demoWrap}>
      <View style={styles.demoGrid}>
        {SELECT_DEMO.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={44}
                showLetter
                selected={SELECTED_D.has(`${c},${r}`)}
              />
            ))}
          </View>
        ))}
      </View>
      {/* Small hand over selected cluster — no dark circle chrome */}
      <View style={styles.handFloat} pointerEvents="none">
        <IconHand size={28} color={colors.text} />
      </View>
    </View>
  );
}

function ClearDemo() {
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

  const y = drop.interpolate({ inputRange: [0, 1], outputRange: [-10, 14] });

  const board: TileColorId[][] = [
    ['A', 'B', 'E', 'D'],
    ['A', 'C', 'C', 'B'],
    ['D', 'C', 'C', 'A'],
    ['E', 'B', 'A', 'D'],
  ];

  return (
    <View style={styles.demoWrap}>
      <View style={styles.demoGrid}>
        {board.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={40}
                showLetter
                selected={(c === 1 || c === 2) && (r === 1 || r === 2)}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.arrowRowCenter}>
        <Animated.View style={{ transform: [{ translateY: y }] }}>
          <IconArrowDown size={24} color={colors.cream} />
        </Animated.View>
        <IconArrowBack size={22} color={colors.cream} />
      </View>
    </View>
  );
}

function MasterDemo() {
  const burst = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    const native = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(burst, {
          toValue: 1.08,
          duration: 650,
          easing: Easing.out(Easing.quad),
          useNativeDriver: native,
        }),
        Animated.timing(burst, { toValue: 0.85, duration: 650, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [burst]);

  const board: TileColorId[][] = [
    ['A', 'B', 'C', 'E'],
    ['B', 'C', 'C', 'D'],
    ['A', 'C', 'C', 'B'],
    ['E', 'D', 'A', 'B'],
  ];

  return (
    <View style={styles.demoWrap}>
      <Animated.View style={[styles.burstRing, { transform: [{ scale: burst }], opacity: burst }]}>
        <IconSparkles size={20} color={colors.gold} />
        <IconSparkles size={16} color={colors.tile.D} />
        <IconSparkles size={18} color={colors.tile.A} />
      </Animated.View>
      <View style={styles.demoGrid}>
        {board.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={40}
                showLetter
                selected={id === 'C' && c >= 1 && c <= 2 && r >= 1 && r <= 2}
              />
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.popLabel}>POP · +49</Text>
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const fade = useRef(new Animated.Value(1)).current;

  const visual = useMemo(() => {
    if (step === 0) return <SelectDemo />;
    if (step === 1) return <ClearDemo />;
    return <MasterDemo />;
  }, [step]);

  const finish = async () => {
    await completeOnboarding();
    navigation.replace('MainMenu');
  };

  const go = (next: number) => {
    const native = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: native }),
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: native }),
    ]).start();
    setTimeout(() => setStep(next), 140);
  };

  const next = () => {
    if (isLast) void finish();
    else go(step + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Text style={styles.eyebrow}>{current.eyebrow}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
        {visual}
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <AppButton label={isLast ? 'Get Started' : 'Next'} onPress={next} variant="primary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.screenPad,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    color: colors.cream,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  demoWrap: {
    marginTop: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  demoGrid: {
    backgroundColor: colors.surface,
    padding: layout.boardPad,
    borderRadius: layout.boardRadius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoRow: { flexDirection: 'row' },
  handFloat: {
    position: 'absolute',
    right: 18,
    bottom: 18,
  },
  arrowRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  burstRing: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  popLabel: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 10,
    textAlign: 'center',
  },
  footer: { paddingBottom: 18, gap: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.cream, width: 22 },
});
