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
import { Card } from '../components/Card';
import { Confetti } from '../components/Confetti';
import { IconCrown, IconHappy, IconPlay, IconTrophy } from '../components/Icons';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

export function GameOverScreen({ navigation, route }: Props) {
  const { score, best, isNewHigh, won, colorCount, boardPreset } = route.params;
  const pop = useSharedValue(0.7);

  useEffect(() => {
    pop.value = withSpring(1, { damping: 12, stiffness: 160 });
  }, [pop]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <Confetti />
      <View style={styles.content}>
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
        ) : null}

        <Card style={styles.card}>
          <Text style={styles.meta}>Score</Text>
          <Text style={styles.score}>{formatScore(score)}</Text>
          <View style={styles.divider} />
          <Text style={styles.meta}>Best</Text>
          <Text style={styles.best}>{formatScore(best)}</Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Play Again"
          variant="primary"
          icon={<IconPlay size={18} color={colors.textDark} />}
          onPress={() => navigation.replace('Game', { colorCount, boardPreset })}
        />
        <AppButton
          label="Main Menu"
          variant="secondary"
          onPress={() => navigation.popToTop()}
        />
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
    gap: 14,
    zIndex: 1,
  },
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
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: layout.buttonRadius,
    backgroundColor: 'rgba(232,197,71,0.16)',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  newHigh: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 22,
  },
  meta: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  score: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -1,
  },
  best: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  footer: { gap: 12, paddingBottom: 20, zIndex: 1 },
});
