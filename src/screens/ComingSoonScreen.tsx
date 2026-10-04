import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { ScreenBackground } from '../components/ScreenBackground';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typeScale } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

export function ComingSoonScreen({ navigation, route }: Props) {
  const { feature } = route.params;
  return (
    <ScreenBackground showDecorTiles>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Coming Soon</Text>
          <Text style={styles.title}>{feature}</Text>
          <Text style={styles.body}>
            This mode is on the roadmap. Classic play is ready now — clear clusters and chase
            the high score.
          </Text>
        </View>
        <AppButton label="Back to Menu" variant="primary" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: layout.screenPad,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  content: { flex: 1, justifyContent: 'center', gap: 12 },
  eyebrow: {
    ...typeScale.label,
    color: colors.cream,
  },
  title: {
    ...typeScale.display,
    color: colors.text,
  },
  body: {
    ...typeScale.body,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
});
