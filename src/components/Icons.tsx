import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  return <MaterialCommunityIcons name="crown" size={size} color={color} />;
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

export function IconRestart({ size = 20, color = colors.text }: Props) {
  return <MaterialCommunityIcons name="rotate-left" size={size} color={color} />;
}

export function IconHome({ size = 20, color = colors.text }: Props) {
  return <Ionicons name="home-outline" size={size} color={color} />;
}

export function IconHappy({ size = 64, color = colors.gold }: Props) {
  return <Ionicons name="happy" size={size} color={color} />;
}

export function IconChevronBack({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="chevron-back" size={size} color={color} />;
}

export function IconChevronForward({ size = 18, color = colors.textMuted }: Props) {
  return <Ionicons name="chevron-forward" size={size} color={color} />;
}

export function IconLock({ size = 18, color = colors.textMuted }: Props) {
  return <Ionicons name="lock-closed" size={size} color={color} />;
}

export function IconCheck({ size = 18, color = colors.accent }: Props) {
  return <Ionicons name="checkmark-circle" size={size} color={color} />;
}

export function IconStar({ size = 18, color = colors.gold }: Props) {
  return <Ionicons name="star" size={size} color={color} />;
}

export function IconReset({ size = 18, color = colors.danger }: Props) {
  return <Ionicons name="trash-outline" size={size} color={color} />;
}

export function IconTimer({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="timer-outline" size={size} color={color} />;
}

export function IconGrid({ size = 22, color = colors.text }: Props) {
  return <Ionicons name="grid-outline" size={size} color={color} />;
}
