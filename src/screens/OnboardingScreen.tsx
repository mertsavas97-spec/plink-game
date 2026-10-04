import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

/** 5×5 demo board with a magenta C cluster for SELECT. */
const SELECT_DEMO: TileColorId[][] = [
  ['A', 'B', 'D', 'E', 'A'],
  ['B', 'C', 'C', 'D', 'B'],
  ['A', 'C', 'C', 'E', 'D'],
  ['E', 'B', 'A', 'D', 'A'],
  ['D', 'E', 'B', 'A', 'E'],
];

const SELECTED_C = new Set(['1,1', '2,1', '1,2', '2,2']);

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
                size={36}
                showLetter
                selected={SELECTED_C.has(`${c},${r}`)}
                dimmed={!SELECTED_C.has(`${c},${r}`)}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.handBadge}>
        <IconHand size={28} color={colors.cream} />
      </View>
    </View>
  );
}

function ClearDemo() {
  const before: TileColorId[][] = [
    ['A', 'B'],
    ['A', 'C'],
    ['D', 'C'],
  ];
  return (
    <View style={styles.clearDemo}>
      <View style={styles.demoGrid}>
        {before.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile key={`${r}-${c}`} colorId={id} size={34} showLetter />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.arrowCol}>
        <IconArrowDown size={26} />
        <Text style={styles.arrowLabel}>gravity</Text>
        <View style={styles.arrowRow}>
          <IconArrowBack size={26} />
          <Text style={styles.arrowLabel}>columns</Text>
        </View>
      </View>
      <View style={styles.demoGrid}>
        {[
          ['A', 'B'],
          ['A', 'C'],
          ['D', 'C'],
        ].map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {(row as TileColorId[]).map((id, c) => (
              <Tile
                key={`${r}-${c}`}
                colorId={id}
                size={34}
                showLetter
                selected={r === 2}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function MasterDemo() {
  const cluster: TileColorId[][] = [
    ['C', 'C', 'C'],
    ['C', 'C', 'C'],
    ['C', 'C', 'C'],
  ];
  return (
    <View style={styles.masterDemo}>
      <View style={styles.burstRing}>
        <IconSparkles size={22} color={colors.gold} />
        <IconSparkles size={18} color={colors.tile.D} />
        <IconSparkles size={20} color={colors.tile.A} />
      </View>
      <View style={styles.demoGrid}>
        {cluster.map((row, r) => (
          <View key={r} style={styles.demoRow}>
            {row.map((id, c) => (
              <Tile key={`${r}-${c}`} colorId={id} size={38} showLetter selected />
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

  const visual = useMemo(() => {
    if (step === 0) return <SelectDemo />;
    if (step === 1) return <ClearDemo />;
    return <MasterDemo />;
  }, [step]);

  const finish = async () => {
    await completeOnboarding();
    navigation.replace('MainMenu');
  };

  const next = () => {
    if (isLast) void finish();
    else setStep((s) => s + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{current.eyebrow}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
        {visual}
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <PillButton
          label={isLast ? 'Get Started' : 'Next'}
          onPress={next}
          variant={isLast ? 'mint' : 'primary'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: 'center', gap: 14 },
  eyebrow: {
    fontFamily: fonts.bold,
    color: colors.mint,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  body: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  demoWrap: { marginTop: 12, alignSelf: 'flex-start' },
  demoGrid: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoRow: { flexDirection: 'row' },
  handBadge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDemo: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  arrowCol: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  arrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  arrowLabel: {
    fontFamily: fonts.semibold,
    color: colors.cream,
    fontSize: 11,
    fontWeight: '600',
  },
  masterDemo: { marginTop: 16, alignItems: 'center', gap: 10 },
  burstRing: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 4,
  },
  popLabel: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: { paddingBottom: 16, gap: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.cream, width: 20 },
});
