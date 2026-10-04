import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconChevronBack } from './Icons';
import { colors } from '../theme/colors';
import { layout } from '../theme/layout';
import { typeScale } from '../theme/typography';

interface Props {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

/** Shared screen header — back chevron + centered title. */
export function Header({ title, onBack, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityLabel="Back"
            onPress={onBack}
            style={styles.btn}
            hitSlop={8}
          >
            <IconChevronBack />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.iconBtn,
    marginBottom: 12,
  },
  side: {
    width: layout.iconBtn + 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: { alignItems: 'flex-end' },
  btn: {
    width: layout.iconBtn,
    height: layout.iconBtn,
    minWidth: layout.iconBtn,
    minHeight: layout.iconBtn,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typeScale.title,
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
});
