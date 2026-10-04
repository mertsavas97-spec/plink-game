import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppButton } from '../components/AppButton';
import {
  IconCalendar,
  IconCrown,
  IconPalette,
  IconPlay,
  IconSettings,
  IconTrophy,
} from '../components/Icons';
import { ListButton } from '../components/ListButton';
import { PlinkLogo } from '../components/PlinkLogo';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

export function MainMenuScreen({ navigation }: Props) {
  const { highScore } = useApp();
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: 420 });
  }, [enter]);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 16 }],
  }));

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

      <Animated.View style={[styles.hero, heroStyle]}>
        <PlinkLogo size="lg" animated showTagline />
      </Animated.View>

      <View style={styles.actions}>
        <AppButton
          label="Play"
          variant="primary"
          icon={<IconPlay size={18} color={colors.textDark} />}
          onPress={() => navigation.navigate('NewGame')}
        />
        <ListButton
          label="Daily Puzzle"
          icon={<IconCalendar />}
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Daily Puzzle' })}
        />
        <ListButton
          label="Challenges"
          icon={<IconTrophy size={20} color={colors.text} />}
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Challenges' })}
        />
        <ListButton
          label="Themes"
          icon={<IconPalette />}
          onPress={() => navigation.navigate('ComingSoon', { feature: 'Themes' })}
        />
      </View>

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
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.screenPad,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 4 },
  gear: {
    width: 46,
    height: 46,
    borderRadius: layout.buttonRadius,
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
    paddingBottom: 8,
  },
  actions: { gap: layout.sectionGap, marginBottom: 18 },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginBottom: 14,
    borderRadius: layout.buttonRadius,
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
