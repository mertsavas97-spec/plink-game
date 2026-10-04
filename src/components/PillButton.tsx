import React, { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'mint' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: ReactNode;
}

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
  icon,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon}
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 999,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.4 },
  label: {
    fontFamily: fonts.bold,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.cream },
  secondary: { backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border },
  mint: { backgroundColor: colors.mint },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: 'transparent' },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.textDark },
  secondary: { color: colors.text },
  mint: { color: colors.textDark },
  ghost: { color: colors.text },
  danger: { color: colors.danger },
});
