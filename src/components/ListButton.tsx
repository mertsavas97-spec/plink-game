import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

interface Props {
  label: string;
  onPress: () => void;
  icon: ReactNode;
  disabled?: boolean;
}

/** Menu list row: icon left, text left-aligned, secondary surface. */
export function ListButton({ label, onPress, icon, disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: layout.listButtonHeight,
    borderRadius: layout.buttonRadius,
    paddingHorizontal: layout.buttonPadH,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.buttonIconGap,
  },
  icon: { width: 24, alignItems: 'center', justifyContent: 'center' },
  label: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: layout.buttonLabelSize,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'left',
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.4 },
});
