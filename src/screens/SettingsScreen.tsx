import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BOARD_PRESETS, BOARD_PRESET_ORDER, type BoardPreset } from '../engine';
import { Header } from '../components/Header';
import {
  IconChevronForward,
  IconGrid,
  IconLanguage,
  IconLetters,
  IconReset,
  IconUndoLimit,
  IconVibrate,
  IconVolume,
} from '../components/Icons';
import { ListItem } from '../components/ListItem';
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts, typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const GRID_OPTIONS: BoardPreset[] = BOARD_PRESET_ORDER;

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

const ICON = 20;
const MUTED = colors.textMuted;

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings, resetAllProgress } = useApp();

  const bumpUndo = (delta: number) => {
    const next = Math.min(20, Math.max(1, settings.undoLimit + delta));
    updateSettings({ undoLimit: next });
  };

  const cycleGrid = () => {
    const current = GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '10x14';
    const idx = GRID_OPTIONS.indexOf(current);
    const next = GRID_OPTIONS[(idx + 1) % GRID_OPTIONS.length];
    updateSettings({ defaultBoardPreset: next });
  };

  const gridLabel = BOARD_PRESETS[
    GRID_OPTIONS.includes(settings.defaultBoardPreset)
      ? settings.defaultBoardPreset
      : '10x14'
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
            icon={<IconVolume size={ICON} color={MUTED} />}
            right={
              <Switch
                value={settings.soundEnabled}
                onValueChange={(v) => updateSettings({ soundEnabled: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            }
          />
          <ListItem
            label="Vibration"
            icon={<IconVibrate size={ICON} color={MUTED} />}
            right={
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(v) => updateSettings({ vibrationEnabled: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            }
          />
          <ListItem
            label="Language"
            icon={<IconLanguage size={ICON} color={MUTED} />}
            onPress={() => navigation.navigate('Language')}
            right={
              <View style={styles.inlineRight}>
                <Text style={styles.value}>
                  {LANG_LABEL[settings.language] ?? settings.language}
                </Text>
                <IconChevronForward />
              </View>
            }
          />
          <ListItem
            label="Undo Limit"
            icon={<IconUndoLimit size={ICON} color={MUTED} />}
            right={
              <View style={styles.stepper}>
                <Pressable onPress={() => bumpUndo(-1)} style={styles.stepBtn}>
                  <Text style={styles.stepTxt}>−</Text>
                </Pressable>
                <Text style={styles.value}>{settings.undoLimit}</Text>
                <Pressable onPress={() => bumpUndo(1)} style={styles.stepBtn}>
                  <Text style={styles.stepTxt}>+</Text>
                </Pressable>
              </View>
            }
          />
          <ListItem
            label="Grid Size"
            icon={<IconGrid size={ICON} color={MUTED} />}
            right={
              <Pressable onPress={cycleGrid} style={styles.gridBtn}>
                <Text style={styles.value}>{gridLabel}</Text>
                <IconChevronForward />
              </Pressable>
            }
          />
          <ListItem
            label="Letters"
            icon={<IconLetters size={ICON} color={MUTED} />}
            right={
              <Switch
                value={settings.showTileLetters}
                onValueChange={(v) => updateSettings({ showTileLetters: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            }
          />
        </View>

        <Pressable onPress={confirmReset} style={styles.reset}>
          <IconReset />
          <Text style={styles.resetText}>Reset Progress</Text>
        </Pressable>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: layout.screenPad },
  group: {
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inlineRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  value: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTxt: { ...typeScale.title, color: colors.text, fontSize: 18 },
  gridBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reset: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  resetText: {
    fontFamily: fonts.semibold,
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
