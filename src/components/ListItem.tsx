import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

interface Props {
  label: string;
  hint?: string;
  onPress?: () => void;
  right?: ReactNode;
  /** 20px muted outline leading icon */
  icon?: ReactNode;
  disabled?: boolean;
}

export function ListItem({ label, hint, onPress, right, icon, disabled }: Props) {
  const body = (
    <View style={[styles.row, disabled && styles.disabled]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {right}
    </View>
  );
  if (!onPress || disabled) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 52,
  },
  icon: {
    width: 28,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, paddingRight: 12 },
  label: {
    fontFamily: fonts.semibold,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55 },
});
