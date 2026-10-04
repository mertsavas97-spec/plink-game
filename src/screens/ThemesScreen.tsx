import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  preview: TileColorId[];
}> = [
  { id: 'classic', name: 'Classic', locked: false, preview: ['A', 'B', 'C', 'D', 'E'] },
  { id: 'ocean', name: 'Ocean', locked: true, preview: ['A', 'E', 'A', 'E', 'A'] },
  { id: 'forest', name: 'Forest', locked: true, preview: ['D', 'A', 'E', 'D', 'A'] },
];

export function ThemesScreen({ navigation }: Props) {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState('classic');
  const theme = THEMES[tab] ?? THEMES[0];

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Themes" onBack={() => navigation.goBack()} />
        <Tabs
          tabs={['Classic', 'Ocean', 'Forest']}
          active={tab}
          onChange={setTab}
        />

        <Pressable
          disabled={theme.locked}
          onPress={() => {
            if (!theme.locked) setActive(theme.id);
          }}
        >
          <Card style={[styles.card, theme.locked && styles.lockedCard]}>
            <View style={styles.previewRow}>
              {theme.preview.map((id, i) => (
                <Tile key={`${theme.id}-${i}`} colorId={id} size={40} showLetter gap={4} />
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
            {!theme.locked ? (
              <Text style={styles.hint}>Active palette for classic play.</Text>
            ) : (
              <Text style={styles.hint}>Preview only — unlock later.</Text>
            )}
          </Card>
        </Pressable>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  card: { gap: 14, paddingVertical: 20 },
  lockedCard: { opacity: 1 },
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
