import React, { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import {
  IconGrid,
  IconStar,
  IconTimer,
  IconTrophy,
  IconUndo,
} from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { Tabs } from '../components/Tabs';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import {
  CHALLENGE_TARGETS,
  type ChallengeId,
} from '../storage/persistence';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Challenges'>;

const CARDS: Array<{
  id: ChallengeId;
  title: string;
  reward: string;
  icon: ReactNode;
}> = [
  {
    id: 'clear100',
    title: 'Clear 100 tiles',
    reward: '+500',
    icon: <IconGrid size={22} color={colors.accent} />,
  },
  {
    id: 'score50k',
    title: 'Score 50,000',
    reward: '+1,000',
    icon: <IconTrophy size={22} color={colors.gold} />,
  },
  {
    id: 'under2min',
    title: 'Finish under 2 min',
    reward: '+1,000',
    icon: <IconTimer size={22} color={colors.tile.E} />,
  },
  {
    id: 'undo3',
    title: 'Use undo 3 times',
    reward: '+500',
    icon: <IconUndo size={22} color={colors.cream} />,
  },
];

export function ChallengesScreen({ navigation }: Props) {
  const { challenges } = useApp();
  const [tab, setTab] = useState(0);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Challenges" onBack={() => navigation.goBack()} />
        <Tabs tabs={['Weekly', 'All']} active={tab} onChange={setTab} />

        <View style={styles.list}>
          {(tab === 0 ? CARDS : CARDS).map((c) => {
            const target = CHALLENGE_TARGETS[c.id];
            const value = challenges[c.id];
            const pct = Math.min(1, value / target);
            const done = value >= target;
            return (
              <Card key={c.id} style={styles.card}>
                <View style={styles.top}>
                  <View style={styles.iconWrap}>{c.icon}</View>
                  <View style={styles.copy}>
                    <Text style={styles.title}>{c.title}</Text>
                    <Text style={styles.progress}>
                      {value.toLocaleString('en-US')} / {target.toLocaleString('en-US')}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <IconStar size={14} />
                    <Text style={styles.reward}>{c.reward}</Text>
                  </View>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pct * 100}%`,
                        backgroundColor: done ? colors.gold : colors.accent,
                      },
                    ]}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  list: { gap: 12, paddingBottom: 16 },
  card: { paddingVertical: 14, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  progress: {
    ...typeScale.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(232,197,71,0.14)',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  reward: {
    fontFamily: fonts.bold,
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },
});
