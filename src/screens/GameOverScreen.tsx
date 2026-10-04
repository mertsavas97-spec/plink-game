import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppButton } from '../components/AppButton';
import { Confetti } from '../components/Confetti';
import { IconCrown, IconHappy, IconPlay, IconTrophy } from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import type { RootStackParamList } from '../navigation/types';
import { dateSeed, todayKey } from '../storage/persistence';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

export function GameOverScreen({ navigation, route }: Props) {
  const { score, best, isNewHigh, won, colorCount, boardPreset, daily } = route.params;
  const pop = useSharedValue(0.7);

  useEffect(() => {
    pop.value = withSpring(1, { damping: 12, stiffness: 160 });
  }, [pop]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <ScreenBackground decorPreset="result">
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.confettiHost} pointerEvents="none">
          <Confetti />
        </View>

        <View style={styles.content}>
          <View style={styles.resultGroup}>
            <Animated.View style={[styles.iconWrap, iconStyle]}>
              {won ? (
                <IconTrophy size={72} color={colors.gold} />
              ) : (
                <IconHappy size={72} color={colors.gold} />
              )}
            </Animated.View>
            <Text style={styles.title}>{won ? 'Board Cleared!' : 'Game Over'}</Text>
            {isNewHigh ? (
              <View style={styles.badge}>
                <IconCrown size={16} />
                <Text style={styles.newHigh}>New High Score!</Text>
              </View>
            ) : (
              <View style={styles.badgePlaceholder} />
            )}

            <Text style={styles.meta}>Score</Text>
            <Text style={styles.score}>{formatScore(score)}</Text>
            <View style={styles.divider} />
            <Text style={styles.meta}>Best</Text>
            <Text style={styles.best}>{formatScore(best)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            label="Play Again"
            variant="primary"
            icon={<IconPlay size={18} color={colors.textDark} />}
            onPress={() =>
              navigation.replace('Game', {
                colorCount,
                boardPreset,
                daily,
                seed: daily ? dateSeed(todayKey()) : undefined,
              })
            }
          />
          <AppButton
            label="Main Menu"
            variant="secondary"
            onPress={() => navigation.popToTop()}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  confettiHost: { ...StyleSheet.absoluteFill, zIndex: 0 },
  content: { flex: 1, justifyContent: 'center', zIndex: 2 },
  resultGroup: { alignItems: 'center', gap: 8 },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { ...typeScale.display, color: colors.text },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: layout.buttonRadius,
    backgroundColor: 'rgba(232,197,71,0.16)',
    borderWidth: 1,
    borderColor: colors.gold,
    minHeight: 36,
    marginBottom: 8,
  },
  badgePlaceholder: { height: 36, marginBottom: 8 },
  newHigh: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  meta: { ...typeScale.label, color: colors.textMuted },
  score: { ...typeScale.scoreLarge, color: colors.text, marginTop: 2 },
  best: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: 120,
    backgroundColor: colors.borderStrong,
    marginVertical: 12,
  },
  footer: { gap: 12, paddingBottom: 16, zIndex: 2 },
});
