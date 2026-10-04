import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IconCrown, IconPlay, IconSettings } from '../components/Icons';
import { PillButton } from '../components/PillButton';
import { PlinkLogo } from '../components/PlinkLogo';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

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
          <IconSettings />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <PlinkLogo size="lg" />
        <Text style={styles.tagline}>SAME COLORS. BIGGER MOMENTS.</Text>
      </View>

      <View style={styles.actions}>
        <PillButton
          label="Play"
          variant="primary"
          icon={<IconPlay size={18} color={colors.textDark} />}
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

      <View style={styles.footerBanner}>
        <IconCrown size={20} />
        <View>
          <Text style={styles.highLabel}>High Score</Text>
          <Text style={styles.highValue}>{formatScore(highScore)}</Text>
        </View>
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
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  tagline: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  actions: { gap: 12, marginBottom: 20 },
  play: { minHeight: 58 },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  highValue: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800',
  },
});
