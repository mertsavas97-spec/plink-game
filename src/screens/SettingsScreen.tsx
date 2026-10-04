import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, type BoardPreset } from '../engine';
import { Header } from '../components/Header';
import { IconChevronForward, IconReset } from '../components/Icons';
import { ListItem } from '../components/ListItem';
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const GRID_OPTIONS: BoardPreset[] = ['10x10', '12x14', '16x18'];

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  tr: 'Türkçe',
  fr: 'Français',
  ar: 'العربية',
  it: 'Italiano',
  pt: 'Português',
};

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings, resetAllProgress } = useApp();

  const bumpUndo = (delta: number) => {
    const next = Math.min(20, Math.max(1, settings.undoLimit + delta));
    updateSettings({ undoLimit: next });
  };

  const cycleGrid = () => {
    const current = GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '12x14';
    const idx = GRID_OPTIONS.indexOf(current);
    const next = GRID_OPTIONS[(idx + 1) % GRID_OPTIONS.length];
    updateSettings({ defaultBoardPreset: next });
  };

  const gridLabel = BOARD_PRESETS[
    GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '12x14'
  ].label;

  const confirmReset = () => {
    Alert.alert(
      'Reset Progress',
      'This clears high score, daily puzzle, challenges, and onboarding. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => void resetAllProgress(),
        },
      ],
    );
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Settings" onBack={() => navigation.goBack()} />

        <View style={styles.group}>
          <ListItem
            label="Sound & Music"
            right={
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => updateSettings({ soundEnabled: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.text}
              />
            }
          />
          <ListItem
            label="Vibration"
            right={
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(v) => updateSettings({ vibrationEnabled: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.text}
              />
            }
          />
          <ListItem
            label="Language"
            onPress={() => navigation.navigate('Language')}
            right={
              <View style={styles.langRight}>
                <Text style={styles.langValue}>
                  {LANG_LABEL[settings.language] ?? 'English'}
                </Text>
                <IconChevronForward />
              </View>
            }
          />
        </View>

        <Text style={styles.section}>Game</Text>
        <View style={styles.group}>
          <ListItem
            label="Undo Limit"
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
          <ListItem
            label="Grid Size"
            right={
              <Pressable onPress={cycleGrid} style={styles.gridBtn}>
                <Text style={styles.gridBtnText}>{gridLabel}</Text>
              </Pressable>
            }
          />
          <ListItem
            label="Letters on tiles"
            right={
              <Switch
                value={settings.showTileLetters}
                onValueChange={(v) => updateSettings({ showTileLetters: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.text}
              />
            }
          />
        </View>

        <Pressable onPress={confirmReset} style={styles.reset}>
          <IconReset size={18} color={colors.danger} />
          <Text style={styles.resetText}>Reset Progress</Text>
        </Pressable>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  group: {
    backgroundColor: colors.surface,
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  section: {
    ...typeScale.label,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 10,
  },
  langRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  langValue: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
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
    fontVariant: ['tabular-nums'],
  },
  gridBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: layout.buttonRadius,
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
  reset: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  resetText: {
    fontFamily: fonts.bold,
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
