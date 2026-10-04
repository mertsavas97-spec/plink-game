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
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: ReactNode;
  /** Stretch full width (default true). */
  fullWidth?: boolean;
}

/** Shared CTA — rounded rectangle (not pill), theme-driven. */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
  icon,
  fullWidth = true,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles[variant],
        pressed && (variant === 'primary' ? styles.pressedPrimary : styles.pressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

/** @deprecated Use AppButton — kept as alias for gradual imports. */
export const PillButton = AppButton;

const styles = StyleSheet.create({
  base: {
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    paddingHorizontal: layout.buttonPadH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.buttonIconGap,
  },
  iconSlot: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.88 },
  pressedPrimary: { backgroundColor: colors.creamPressed },
  disabled: { opacity: 0.4 },
  label: {
    fontFamily: fonts.bold,
    fontSize: layout.buttonLabelSize,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.cream },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: { backgroundColor: 'transparent' },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.textDark },
  secondary: { color: colors.text },
  ghost: { color: colors.text },
  danger: { color: colors.danger },
});
