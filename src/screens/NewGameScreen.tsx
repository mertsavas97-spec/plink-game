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
const SIZE_OPTIONS: BoardPreset[] = ['8x8', '10x10', '12x12'];

const DIFFICULTY_COLOR: Record<ColorCount, string> = {
  3: colors.difficulty.easy,
  4: colors.difficulty.medium,
  5: colors.difficulty.hard,
};

export function NewGameScreen({ navigation }: Props) {
  const { settings } = useApp();
  const [colorCount, setColorCount] = useState<ColorCount>(4);
  const [boardPreset, setBoardPreset] = useState<BoardPreset>(
    SIZE_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '8x8',
  );

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
                active && { backgroundColor: `${accent}28` },
              ]}
            >
              <Text style={[styles.colorNum, { color: accent, opacity: active ? 1 : 0.55 }]}>
                {n}
              </Text>
              <Text
                style={[
                  styles.colorLabel,
                  { color: active ? colors.text : accent, opacity: active ? 1 : 0.75 },
                ]}
              >
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
          const dim = preset === '8x8' ? 3 : preset === '10x10' ? 4 : 5;
          const cells = dim * dim;
          return (
            <Pressable
              key={preset}
              onPress={() => setBoardPreset(preset)}
              style={[styles.sizePill, active && styles.sizePillActive]}
            >
              <View style={[styles.miniGrid, { width: dim * 8 + (dim - 1) * 2 }]}>
                {Array.from({ length: cells }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniCell,
                      { backgroundColor: active ? colors.cream : colors.border },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]}>
                {size.label}
              </Text>
              <Text style={styles.sizeMeta}>{size.blurb}</Text>
              <Text style={styles.sizeCount}>{size.tileCount}</Text>
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
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 28,
  },
  section: {
    fontFamily: fonts.bold,
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  colorCircle: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 112,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  colorNum: { fontFamily: fonts.extrabold, fontSize: 30, fontWeight: '800' },
  colorLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    fontWeight: '600',
  },
  sizeRow: { flexDirection: 'row', gap: 10, flex: 1, alignItems: 'flex-start' },
  sizePill: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sizePillActive: {
    borderColor: colors.cream,
    backgroundColor: colors.surfaceElevated,
  },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
    marginBottom: 2,
  },
  miniCell: { width: 8, height: 8, borderRadius: 2 },
  sizeLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  sizeLabelActive: { color: colors.text },
  sizeMeta: {
    fontFamily: fonts.semibold,
    color: colors.cream,
    fontSize: 11,
    fontWeight: '600',
  },
  sizeCount: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 11,
  },
  footer: { paddingBottom: 16, paddingTop: 8 },
});
