import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, COLOR_COUNT_LABELS, type BoardPreset, type ColorCount } from '../engine';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { IconClose, IconSettings } from '../components/Icons';
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'NewGame'>;

const COLOR_OPTIONS: ColorCount[] = [3, 4, 5];
const SIZE_OPTIONS: BoardPreset[] = ['10x10', '12x14', '16x18'];

const DIFFICULTY_COLOR: Record<ColorCount, string> = {
  3: colors.difficulty.easy,
  4: colors.difficulty.medium,
  5: colors.difficulty.hard,
};

/** Mini preview grid proportions for size cards (cols × rows visual). */
function MiniGrid({ cols, rows, active }: { cols: number; rows: number; active: boolean }) {
  const cell = 5;
  const gap = 1.5;
  // Show a scaled-down aspect preview (max 5×6 cells for readability)
  const c = Math.min(cols, 5);
  const r = Math.min(rows, 6);
  return (
    <View
      style={{
        width: c * cell + (c - 1) * gap,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap,
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: c * r }).map((_, i) => (
        <View
          key={i}
          style={{
            width: cell,
            height: cell,
            borderRadius: 1.5,
            backgroundColor: active ? colors.cream : colors.borderStrong,
          }}
        />
      ))}
    </View>
  );
}

export function NewGameScreen({ navigation }: Props) {
  const { settings } = useApp();
  const [colorCount, setColorCount] = useState<ColorCount>(4);
  const initial =
    SIZE_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '12x14';
  const [boardPreset, setBoardPreset] = useState<BoardPreset>(initial);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Close"
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <IconClose />
        </Pressable>
        <Text style={styles.title}>New Game</Text>
        <Pressable
          accessibilityLabel="Settings"
          onPress={() => navigation.navigate('Settings')}
          style={styles.iconBtn}
        >
          <IconSettings />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Choose your game mode</Text>

      <Text style={styles.section}>Colors</Text>
      <Card style={styles.colorPanel}>
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
                <Text style={[styles.colorNum, { color: accent }]}>{n}</Text>
                <Text style={[styles.colorLabel, { color: active ? colors.text : colors.textMuted }]}>
                  {COLOR_COUNT_LABELS[n]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Text style={styles.section}>Board Size</Text>
      <View style={styles.sizeRow}>
        {SIZE_OPTIONS.map((preset) => {
          const size = BOARD_PRESETS[preset];
          const active = preset === boardPreset;
          return (
            <Pressable
              key={preset}
              onPress={() => setBoardPreset(preset)}
              style={[styles.sizeCard, active && styles.sizeCardActive]}
            >
              <MiniGrid cols={size.cols} rows={size.rows} active={active} />
              <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]}>
                {size.label}
              </Text>
              <Text style={[styles.sizeCount, active && { color: colors.cream }]}>
                ({size.tileCount})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton
          label="Start"
          variant="primary"
          onPress={() => navigation.navigate('Game', { colorCount, boardPreset })}
        />
      </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: layout.screenPad,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  iconBtn: {
    width: layout.iconBtn,
    height: layout.iconBtn,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typeScale.title,
    fontSize: 22,
    color: colors.text,
  },
  subtitle: {
    ...typeScale.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  section: {
    ...typeScale.label,
    color: colors.textMuted,
    marginBottom: 10,
  },
  colorPanel: { marginBottom: 22, paddingVertical: 14 },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  colorCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  colorNum: { fontFamily: fonts.extrabold, fontSize: 24, fontWeight: '800' },
  colorLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    fontWeight: '600',
  },
  sizeRow: { flexDirection: 'row', gap: 10, flex: 1, alignItems: 'flex-start' },
  sizeCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sizeCardActive: {
    borderColor: colors.cream,
    backgroundColor: colors.surfaceElevated,
  },
  sizeLabel: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  sizeLabelActive: { color: colors.text },
  sizeCount: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
  },
  footer: { paddingBottom: 16, paddingTop: 8 },
});
