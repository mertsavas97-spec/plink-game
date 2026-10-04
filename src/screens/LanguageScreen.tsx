import React from 'react';
import { I18nManager, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { IconCheck } from '../components/Icons';
import { ListItem } from '../components/ListItem';
import { ScreenBackground } from '../components/ScreenBackground';
import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

const LANGUAGES: Array<{
  code: string;
  label: string;
  ready: boolean;
  rtl?: boolean;
}> = [
  { code: 'en', label: 'English', ready: true },
  { code: 'de', label: 'Deutsch', ready: true },
  { code: 'es', label: 'Español', ready: true },
  { code: 'fr', label: 'Français', ready: false },
  { code: 'ar', label: 'العربية', ready: false, rtl: true },
  { code: 'it', label: 'Italiano', ready: false },
  { code: 'pt', label: 'Português', ready: false },
  { code: 'tr', label: 'Türkçe', ready: true },
];

export function LanguageScreen({ navigation }: Props) {
  const { settings, updateSettings } = useApp();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <Header title="Language" onBack={() => navigation.goBack()} />
        <View style={styles.group}>
          {LANGUAGES.map((lang) => {
            const active = settings.language === lang.code;
            return (
              <ListItem
                key={lang.code}
                label={lang.label}
                disabled={!lang.ready}
                onPress={
                  lang.ready
                    ? () => {
                        updateSettings({ language: lang.code });
                        // Keep UI LTR for MVP; mark Arabic as RTL-safe when ready
                        if (lang.rtl && I18nManager.isRTL !== true) {
                          // no forceRTL flip in MVP — layout stays stable
                        }
                      }
                    : undefined
                }
                right={
                  lang.ready ? (
                    active ? <IconCheck size={20} /> : <View style={styles.spacer} />
                  ) : (
                    <View style={styles.soon}>
                      <Text style={styles.soonText}>Soon</Text>
                    </View>
                  )
                }
              />
            );
          })}
        </View>
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
  soon: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  soonText: {
    fontFamily: fonts.semibold,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  spacer: { width: 20 },
});
