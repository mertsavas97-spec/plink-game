import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IconTrophy } from '../components/Icons';
import { PillButton } from '../components/PillButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function formatScore(n: number) {
  return n.toLocaleString('en-US');
}

export function GameOverScreen({ navigation, route }: Props) {
  const { score, best, isNewHigh, won, colorCount, boardPreset } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.trophyWrap}>
          <IconTrophy size={72} color={colors.gold} />
        </View>
        <Text style={styles.title}>{won ? 'Board Cleared!' : 'No Moves Left'}</Text>
        {isNewHigh ? (
          <View style={styles.badge}>
            <Text style={styles.newHigh}>New High Score!</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.meta}>Score</Text>
          <Text style={styles.score}>{formatScore(score)}</Text>
          <View style={styles.divider} />
          <Text style={styles.meta}>Best</Text>
          <Text style={styles.best}>{formatScore(best)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PillButton
          label="Play Again"
          variant="primary"
          onPress={() => navigation.replace('Game', { colorCount, boardPreset })}
        />
        <PillButton
          label="Main Menu"
          variant="secondary"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  trophyWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
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
    fontSize: 30,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(232,197,71,0.15)',
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
    marginTop: 16,
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  meta: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  score: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 4,
  },
  best: {
    fontFamily: fonts.extrabold,
    color: colors.gold,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  footer: { gap: 12, paddingBottom: 20 },
});
