import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PillButton } from '../components/PillButton';
import { PlinkLogo } from '../components/PlinkLogo';
import { Tile } from '../components/Tile';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const STEPS = [
  {
    id: 'welcome',
    eyebrow: 'WELCOME',
    title: 'SAME COLORS.\nBIGGER MOMENTS.',
    body: 'A modern take on the classic color-cluster puzzle. Clear groups, collapse the board, chase a new high score.',
  },
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

const DEMO: TileColorId[][] = [
  ['A', 'A', 'B', 'C'],
  ['A', 'D', 'B', 'E'],
  ['D', 'D', 'C', 'C'],
  ['E', 'B', 'B', 'A'],
];

export function OnboardingScreen({ navigation }: Props) {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const selectedDemo = useMemo(() => new Set(['0,0', '1,0', '0,1']), []);

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
        {step === 0 ? (
          <>
            <PlinkLogo size="lg" />
            <Text style={styles.slogan}>{current.title}</Text>
            <View style={styles.demoGrid}>
              {DEMO.map((row, r) => (
                <View key={r} style={styles.demoRow}>
                  {row.map((id, c) => (
                    <Tile key={`${r}-${c}`} colorId={id} size={44} showLetter />
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.body}>{current.body}</Text>
          </>
        ) : (
          <>
            <Text style={styles.eyebrow}>{current.eyebrow}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.body}>{current.body}</Text>
            {step === 1 ? (
              <View style={styles.demoGrid}>
                {DEMO.map((row, r) => (
                  <View key={r} style={styles.demoRow}>
                    {row.map((id, c) => (
                      <Tile
                        key={`${r}-${c}`}
                        colorId={id}
                        size={40}
                        showLetter
                        selected={selectedDemo.has(`${c},${r}`)}
                      />
                    ))}
                  </View>
                ))}
              </View>
            ) : null}
            {step === 2 ? (
              <Text style={styles.hintVisual}>↓ gravity  ·  ← columns pack</Text>
            ) : null}
            {step === 3 ? (
              <Text style={styles.hintVisual}>Bigger clusters  ·  Faster clears</Text>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <PillButton
          label={step === 0 ? 'Get Started' : isLast ? 'Play PLINK' : 'Next'}
          onPress={next}
          variant={isLast ? 'mint' : 'primary'}
        />
        {step > 0 && !isLast ? (
          <PillButton label="Skip" onPress={() => void finish()} variant="ghost" style={styles.skip} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: 'center', gap: 18 },
  slogan: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginTop: 8,
  },
  eyebrow: {
    color: colors.mint,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  demoGrid: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 14,
    marginVertical: 8,
  },
  demoRow: { flexDirection: 'row' },
  hintVisual: {
    color: colors.cream,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
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
  skip: { marginTop: -4 },
});
