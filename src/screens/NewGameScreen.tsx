import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, COLOR_COUNT_LABELS, type BoardPreset, type ColorCount } from '../engine';
import { PillButton } from '../components/PillButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGame'>;

const COLOR_OPTIONS: ColorCount[] = [3, 4, 5];
const SIZE_OPTIONS: BoardPreset[] = ['10x10', '12x14', '16x18'];

export function NewGameScreen({ navigation }: Props) {
  const [colorCount, setColorCount] = useState<ColorCount>(4);
  const [boardPreset, setBoardPreset] = useState<BoardPreset>('12x14');

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
          return (
            <Pressable
              key={n}
              onPress={() => setColorCount(n)}
              style={[styles.colorCircle, active && styles.colorCircleActive]}
            >
              <Text style={[styles.colorNum, active && styles.colorNumActive]}>{n}</Text>
              <Text style={[styles.colorLabel, active && styles.colorLabelActive]}>
                {COLOR_COUNT_LABELS[n]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Board Size</Text>
      <View style={styles.sizeCol}>
        {SIZE_OPTIONS.map((preset) => {
          const size = BOARD_PRESETS[preset];
          const active = preset === boardPreset;
          return (
            <Pressable
              key={preset}
              onPress={() => setBoardPreset(preset)}
              style={[styles.sizeCard, active && styles.sizeCardActive]}
            >
              <View style={styles.miniGrid}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniCell,
                      { backgroundColor: active ? colors.mint : colors.border },
                    ]}
                  />
                ))}
              </View>
              <View>
                <Text style={styles.sizeLabel}>{size.label}</Text>
                <Text style={styles.sizeMeta}>{size.tileCount} tiles</Text>
              </View>
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
  backText: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 4, marginBottom: 28 },
  section: {
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
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  colorCircleActive: {
    borderColor: colors.cream,
    backgroundColor: colors.surfaceElevated,
  },
  colorNum: { color: colors.textMuted, fontSize: 28, fontWeight: '800' },
  colorNumActive: { color: colors.cream },
  colorLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  colorLabelActive: { color: colors.text },
  sizeCol: { gap: 10, flex: 1 },
  sizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sizeCardActive: { borderColor: colors.mint },
  miniGrid: {
    width: 36,
    height: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  miniCell: { width: 10, height: 10, borderRadius: 2 },
  sizeLabel: { color: colors.text, fontSize: 18, fontWeight: '700' },
  sizeMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  footer: { paddingBottom: 16, paddingTop: 8 },
});
