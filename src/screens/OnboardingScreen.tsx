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
import { PillButton } from '../components/PillButton';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';
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
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const native = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 700, useNativeDriver: native }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.demoWrap}>
      <View style={styles.demoGrid}>
        {SELECT_DEMO.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={48}
                showLetter
                selected={SELECTED_D.has(`${c},${r}`)}
                dimmed={!SELECTED_D.has(`${c},${r}`)}
              />
            ))}
          </View>
        ))}
      </View>
      <Animated.View style={[styles.handBadge, { transform: [{ scale: pulse }] }]}>
        <IconHand size={26} color={colors.cream} />
      </Animated.View>
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

  return (
    <View style={styles.clearDemo}>
      <View style={styles.demoGrid}>
        {(
          [
            ['A', 'B'],
            ['A', 'C'],
            ['D', 'C'],
          ] as TileColorId[][]
        ).map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile key={`${r}-${c}`} colorId={id} size={42} showLetter />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.arrowCol}>
        <Animated.View style={{ transform: [{ translateY: y }] }}>
          <IconArrowDown size={28} color={colors.cream} />
        </Animated.View>
        <Text style={styles.arrowLabel}>gravity</Text>
        <View style={styles.arrowRow}>
          <IconArrowBack size={24} color={colors.cream} />
          <Text style={styles.arrowLabel}>columns</Text>
        </View>
      </View>
      <View style={styles.demoGrid}>
        {(
          [
            ['A', 'B'],
            ['A', 'C'],
            ['D', 'C'],
          ] as TileColorId[][]
        ).map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile key={`${r}-${c}`} colorId={id} size={42} showLetter selected={r === 2} />
            ))}
          </View>
        ))}
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

  const cluster: TileColorId[][] = [
    ['C', 'C', 'C'],
    ['C', 'C', 'C'],
    ['C', 'C', 'C'],
  ];

  return (
    <View style={styles.masterDemo}>
      <Animated.View style={[styles.burstRing, { transform: [{ scale: burst }], opacity: burst }]}>
        <IconSparkles size={22} color={colors.gold} />
        <IconSparkles size={18} color={colors.tile.D} />
        <IconSparkles size={20} color={colors.tile.A} />
      </Animated.View>
      <View style={styles.demoGrid}>
        {cluster.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile key={`${r}-${c}`} colorId={id} size={46} showLetter selected />
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
        <PillButton label={isLast ? 'Get Started' : 'Next'} onPress={next} variant="primary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: 'center', gap: 16, paddingBottom: 12 },
  eyebrow: {
    fontFamily: fonts.bold,
    color: colors.cream,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 25,
  },
  demoWrap: { marginTop: 18, alignSelf: 'flex-start' },
  demoGrid: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoRow: { flexDirection: 'row' },
  handBadge: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDemo: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  arrowCol: { alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  arrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  arrowLabel: {
    fontFamily: fonts.semibold,
    color: colors.cream,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  masterDemo: { marginTop: 20, alignItems: 'center', gap: 12 },
  burstRing: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 2,
  },
  popLabel: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.2,
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
