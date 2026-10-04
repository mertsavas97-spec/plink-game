import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, COLOR_COUNT_LABELS, type BoardPreset, type ColorCount } from '../engine';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGame'>;

const COLOR_OPTIONS: ColorCount[] = [3, 4, 5];
const SIZE_OPTIONS: BoardPreset[] = ['10x10', '12x14', '16x18'];

const DIFFICULTY_COLOR: Record<ColorCount, string> = {
  3: colors.difficulty.easy,
  4: colors.difficulty.medium,
  5: colors.difficulty.hard,
};

export function NewGameScreen({ navigation }: Props) {
  const { settings } = useApp();
  const [colorCount, setColorCount] = useState<ColorCount>(4);
  const [boardPreset, setBoardPreset] = useState<BoardPreset>(settings.defaultBoardPreset);

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>New Game</Text>
      <Text style={styles.subtitle}>Choose difficulty and board size</Text>

      <Text style={styles.section}>Colors</Text>
      <View style={styles.colorRow}>
        {COLOR_OPTIONS.map((n) => {
          const active = n === colorCount;
          const accent = DIFFICULTY_COLOR[n];
          return (
            <Pressable
              key={n}
              onPress={() => setColorCount(n)}
              style={[
                styles.colorCircle,
                { borderColor: active ? accent : colors.border },
                active && { backgroundColor: `${accent}22` },
              ]}
            >
              <Text style={[styles.colorNum, { color: accent, opacity: active ? 1 : 0.55 }]}>
                {n}
              </Text>
              <Text style={[styles.colorLabel, { color: active ? colors.text : accent, opacity: active ? 1 : 0.7 }]}>
                {COLOR_COUNT_LABELS[n]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Board Size</Text>
      <View style={styles.sizeRow}>
        {SIZE_OPTIONS.map((preset) => {
          const size = BOARD_PRESETS[preset];
          const active = preset === boardPreset;
          const cells = preset === '10x10' ? 9 : preset === '12x14' ? 16 : 25;
          const dim = Math.round(Math.sqrt(cells));
          return (
            <Pressable
              key={preset}
              onPress={() => setBoardPreset(preset)}
              style={[styles.sizePill, active && styles.sizePillActive]}
            >
              <View style={[styles.miniGrid, { width: dim * 7 + (dim - 1) * 2 }]}>
                {Array.from({ length: cells }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniCell,
                      { backgroundColor: active ? colors.mint : colors.border },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]}>
                {size.label}
              </Text>
              <Text style={styles.sizeMeta}>{size.tileCount}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <PillButton
          label="Start"
          variant="primary"
          onPress={() => navigation.navigate('Game', { colorCount, boardPreset })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  back: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 28,
  },
  section: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  colorCircle: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 110,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  colorNum: { fontFamily: fonts.extrabold, fontSize: 28, fontWeight: '800' },
  colorLabel: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  sizeRow: { flexDirection: 'row', gap: 10, flex: 1, alignItems: 'flex-start' },
  sizePill: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sizePillActive: { borderColor: colors.mint, backgroundColor: colors.surfaceElevated },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
  miniCell: { width: 7, height: 7, borderRadius: 1.5 },
  sizeLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  sizeLabelActive: { color: colors.text },
  sizeMeta: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 11,
  },
  footer: { paddingBottom: 16, paddingTop: 8 },
});
