import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, type BoardPreset } from '../engine';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
];

const GRID_OPTIONS: BoardPreset[] = ['8x8', '10x10', '12x12'];

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings, resetAllProgress } = useApp();

  const bumpUndo = (delta: number) => {
    const next = Math.min(20, Math.max(1, settings.undoLimit + delta));
    updateSettings({ undoLimit: next });
  };

  const cycleGrid = () => {
    const current = GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '8x8';
    const idx = GRID_OPTIONS.indexOf(current);
    const next = GRID_OPTIONS[(idx + 1) % GRID_OPTIONS.length];
    updateSettings({ defaultBoardPreset: next });
  };

  const gridLabel = BOARD_PRESETS[
    GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '8x8'
  ].label;

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.group}>
        <Row
          label="Sound & Music"
          hint="Stub — wiring later"
          right={
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => updateSettings({ soundEnabled: v })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text}
            />
          }
        />
        <Row
          label="Vibration"
          hint="Stub — wiring later"
          right={
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(v) => updateSettings({ vibrationEnabled: v })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text}
            />
          }
        />
        <Row
          label="Letters on tiles"
          hint="Show A–E for accessibility"
          right={
            <Switch
              value={settings.showTileLetters}
              onValueChange={(v) => updateSettings({ showTileLetters: v })}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.text}
            />
          }
        />
        <Row
          label="Undo Limit"
          hint="Max undo steps per game"
          right={
            <View style={styles.stepper}>
              <Pressable onPress={() => bumpUndo(-1)} style={styles.stepBtn}>
                <Text style={styles.stepBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepValue}>{settings.undoLimit}</Text>
              <Pressable onPress={() => bumpUndo(1)} style={styles.stepBtn}>
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>
          }
        />
        <Row
          label="Grid Size"
          hint="Default for New Game"
          right={
            <Pressable onPress={cycleGrid} style={styles.gridBtn}>
              <Text style={styles.gridBtnText}>{gridLabel}</Text>
            </Pressable>
          }
        />
      </View>

      <Text style={styles.section}>Language</Text>
      <View style={styles.group}>
        {LANGUAGES.map((lang) => {
          const active = settings.language === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => updateSettings({ language: lang.code })}
              style={styles.langRow}
            >
              <Text style={styles.langLabel}>{lang.label}</Text>
              <Text style={styles.check}>{active ? '✓' : ''}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.stubNote}>Language UI is stubbed; copy stays English for MVP.</Text>

      <Pressable onPress={() => void resetAllProgress()} style={styles.reset}>
        <Text style={styles.resetText}>Reset Progress</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Row({
  label,
  hint,
  right,
}: {
  label: string;
  hint?: string;
  right: ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
      </View>
      {right}
    </View>
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
    marginBottom: 22,
    letterSpacing: -0.4,
  },
  section: {
    fontFamily: fonts.bold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 22,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  rowHint: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  stepValue: {
    fontFamily: fonts.bold,
    color: colors.cream,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  gridBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridBtnText: {
    fontFamily: fonts.bold,
    color: colors.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  langLabel: {
    flex: 1,
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  check: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  stubNote: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  reset: { marginTop: 32, alignItems: 'center', padding: 12 },
  resetText: {
    fontFamily: fonts.bold,
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
