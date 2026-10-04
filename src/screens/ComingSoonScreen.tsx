import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PillButton } from '../components/PillButton';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

export function ComingSoonScreen({ navigation, route }: Props) {
  const { feature } = route.params;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>COMING SOON</Text>
        <Text style={styles.title}>{feature}</Text>
        <Text style={styles.body}>
          This mode is on the roadmap. Classic play is ready now — clear clusters and chase
          the high score.
        </Text>
      </View>
      <PillButton label="Back to Menu" variant="primary" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  content: { flex: 1, justifyContent: 'center', gap: 12 },
  eyebrow: {
    fontFamily: fonts.bold,
    color: colors.mint,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  body: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
});
