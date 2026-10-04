import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  size?: number;
  color?: string;
};

export function IconClose({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="close" size={size} color={color} />;
}

export function IconPause({ size = 20, color = colors.text }: Props) {
  return <Ionicons name="pause" size={size} color={color} />;
}

export function IconUndo({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="arrow-undo" size={size} color={color} />;
}

export function IconRedo({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="arrow-redo" size={size} color={color} />;
}

export function IconHint({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="bulb-outline" size={size} color={color} />;
}

export function IconPlay({ size = 18, color = colors.textDark }: Props) {
  return <Ionicons name="play" size={size} color={color} />;
}

export function IconSettings({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="settings-outline" size={size} color={color} />;
}

export function IconCrown({ size = 18, color = colors.gold }: Props) {
  return <Ionicons name="trophy" size={size} color={color} />;
}

export function IconTrophy({ size = 64, color = colors.gold }: Props) {
  return <Ionicons name="trophy" size={size} color={color} />;
}

export function IconCalendar({ size = 20, color = colors.text }: Props) {
  return <Ionicons name="calendar-outline" size={size} color={color} />;
}

export function IconPalette({ size = 20, color = colors.text }: Props) {
  return <Ionicons name="color-palette-outline" size={size} color={color} />;
}

export function IconHand({ size = 36, color = colors.text }: Props) {
  return <Ionicons name="hand-left-outline" size={size} color={color} />;
}

export function IconArrowDown({ size = 28, color = colors.cream }: Props) {
  return <Ionicons name="arrow-down" size={size} color={color} />;
}

export function IconArrowBack({ size = 28, color = colors.cream }: Props) {
  return <Ionicons name="arrow-back" size={size} color={color} />;
}

export function IconSparkles({ size = 28, color = colors.gold }: Props) {
  return <Ionicons name="sparkles" size={size} color={color} />;
}
