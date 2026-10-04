import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { IconCheck, IconLock } from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { Tabs } from '../components/Tabs';
import { Tile } from '../components/Tile';
import type { RootStackParamList } from '../navigation/types';
import { colors, type TileColorId } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Themes'>;

const THEMES: Array<{
  id: string;
  name: string;
  locked: boolean;
  description: string;
  preview: TileColorId[];
}> = [
  {
    id: 'classic',
    name: 'Classic',
    locked: false,
    description: 'The original five-color palette.',
    preview: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    locked: true,
    description: 'Cool blues and seafoam tones.',
    preview: ['A', 'E', 'A', 'E', 'A'],
  },
  {
    id: 'forest',
    name: 'Forest',
    locked: true,
    description: 'Earthy greens and amber accents.',
    preview: ['D', 'A', 'E', 'D', 'A'],
  },
];

export function ThemesScreen({ navigation }: Props) {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState('classic');
  const scrollRef = useRef<ScrollView>(null);
  const cardY = useRef<number[]>([0, 0, 0]);

  const visible = useMemo(() => {
    // Tab 0 = All (show every card); 1–3 filter to matching theme
    if (tab === 0) return THEMES;
    const idx = tab - 1;
    return THEMES[idx] ? [THEMES[idx]] : THEMES;
  }, [tab]);

  const onTabChange = (next: number) => {
    setTab(next);
    if (next === 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const idx = next - 1;
    requestAnimationFrame(() => {
      const y = cardY.current[idx] ?? 0;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    });
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Themes" onBack={() => navigation.goBack()} />
        <Tabs
          tabs={['All', 'Classic', 'Ocean', 'Forest']}
          active={tab}
          onChange={onTabChange}
        />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {(tab === 0 ? THEMES : visible).map((theme, i) => {
            const fullIdx = THEMES.findIndex((t) => t.id === theme.id);
            const dimmed = theme.locked;
            return (
              <Pressable
                key={theme.id}
                disabled={theme.locked}
                onPress={() => {
                  if (!theme.locked) setActive(theme.id);
                }}
                onLayout={(e) => {
                  if (tab === 0) {
                    cardY.current[fullIdx] = e.nativeEvent.layout.y;
                  }
                }}
                style={dimmed ? styles.dimmed : undefined}
              >
                <Card style={styles.card}>
                  <View style={styles.previewRow}>
                    {theme.preview.map((id, pi) => (
                      <Tile
                        key={`${theme.id}-${pi}`}
                        colorId={id}
                        size={40}
                        showLetter
                        gap={4}
                      />
                    ))}
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.name}>{theme.name}</Text>
                    {theme.locked ? (
                      <View style={styles.lockChip}>
                        <IconLock size={16} />
                        <Text style={styles.lockText}>Locked</Text>
                      </View>
                    ) : active === theme.id ? (
                      <IconCheck size={22} />
                    ) : (
                      <Text style={styles.select}>Select</Text>
                    )}
                  </View>
                  <Text style={styles.hint}>{theme.description}</Text>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  list: { gap: 14, paddingBottom: 24, paddingTop: 4 },
  card: { gap: 12, paddingVertical: 18 },
  dimmed: { opacity: 0.55 },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.extrabold,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  select: {
    fontFamily: fonts.semibold,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  lockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockText: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  hint: { ...typeScale.caption, color: colors.textMuted },
});
