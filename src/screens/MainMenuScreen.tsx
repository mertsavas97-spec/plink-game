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
import { Card } from '../components/Card';
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
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

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

  const contentStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 10 }],
  }));

  return (
    <ScreenBackground decorPreset="menu" showLogoGlow>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate('Settings')}
            style={styles.gear}
            hitSlop={8}
          >
            <IconSettings />
          </Pressable>
        </View>

        <Animated.View style={[styles.body, contentStyle]}>
          <View style={styles.spacer1} />
          <View style={styles.hero}>
            <PlinkLogo size="lg" animated showTagline fillWidth />
          </View>
          <View style={styles.spacer2} />

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
              onPress={() => navigation.navigate('DailyPuzzle')}
            />
            <ListButton
              label="Challenges"
              icon={<IconTrophy size={20} color={colors.text} />}
              onPress={() => navigation.navigate('Challenges')}
            />
            <ListButton
              label="Themes"
              icon={<IconPalette />}
              onPress={() => navigation.navigate('Themes')}
            />
          </View>

          <Card style={styles.footerBanner}>
            <IconCrown size={22} />
            <View>
              <Text style={styles.highLabel}>High Score</Text>
              <Text style={styles.highValue}>{formatScore(highScore)}</Text>
            </View>
          </Card>
        </Animated.View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: layout.screenPad,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 4, zIndex: 2 },
  gear: {
    width: layout.iconBtn,
    height: layout.iconBtn,
    minWidth: layout.iconBtn,
    minHeight: layout.iconBtn,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingBottom: 16, zIndex: 1 },
  spacer1: { flex: 1, minHeight: 8 },
  spacer2: { flex: 2, minHeight: 12 },
  hero: { alignItems: 'center', justifyContent: 'center' },
  actions: { gap: layout.listButtonGap },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: layout.highScoreGap,
  },
  highLabel: {
    ...typeScale.label,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  highValue: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
});
