import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { fonts } from '../theme/typography';

interface Props {
  tabs: string[];
  active: number;
  onChange: (index: number) => void;
}

export function Tabs({ tabs, active, onChange }: Props) {
  return (
    <View style={styles.row}>
      {tabs.map((label, i) => {
        const on = i === active;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(i)}
            style={[styles.tab, on && styles.tabOn]}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: layout.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: layout.buttonRadius - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabOn: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelOn: { color: colors.text },
});
