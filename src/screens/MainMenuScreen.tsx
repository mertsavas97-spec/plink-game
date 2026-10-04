import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    Animated.timing(enter, {
      toValue: 1,
      duration: 480,
      useNativeDriver: native,
    }).start();
  }, [enter]);

  const shift = enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

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

      <Animated.View style={[styles.hero, { opacity: enter, transform: [{ translateY: shift }] }]}>
        <PlinkLogo size="lg" animated />
        <Text style={styles.tagline}>SAME COLORS. BIGGER MOMENTS.</Text>
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: enter }]}>
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
      </Animated.View>

      <View style={styles.footerBanner}>
        <IconCrown size={22} />
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 8,
  },
  tagline: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  actions: { gap: 12, marginBottom: 18 },
  play: { minHeight: 60 },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  highValue: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 1,
  },
});
