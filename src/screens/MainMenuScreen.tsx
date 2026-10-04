import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PillButton } from '../components/PillButton';
import { PlinkLogo } from '../components/PlinkLogo';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

export function MainMenuScreen({ navigation }: Props) {
  const { highScore } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityLabel="Settings"
          onPress={() => navigation.navigate('Settings')}
          style={styles.gear}
        >
          <Text style={styles.gearText}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <PlinkLogo size="lg" />
        <Text style={styles.tagline}>SAME COLORS. BIGGER MOMENTS.</Text>
      </View>

      <View style={styles.actions}>
        <PillButton
          label="Play"
          variant="mint"
          onPress={() => navigation.navigate('NewGame')}
          style={styles.play}
        />
        <PillButton
          label="Daily Puzzle"
          variant="secondary"
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Daily Puzzle' })}
        />
        <PillButton
          label="Challenges"
          variant="secondary"
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Challenges' })}
        />
        <PillButton
          label="Themes"
          variant="secondary"
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Themes' })}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.crown}>♛</Text>
        <Text style={styles.highLabel}>High Score</Text>
        <Text style={styles.highValue}>{formatScore(highScore)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 4 },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearText: { color: colors.text, fontSize: 20 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', gap: 10 },
  tagline: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  actions: { gap: 12, marginBottom: 28 },
  play: { minHeight: 58 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 18,
  },
  crown: { color: colors.gold, fontSize: 18 },
  highLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  highValue: { color: colors.gold, fontSize: 16, fontWeight: '800' },
});
