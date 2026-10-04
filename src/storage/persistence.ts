import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOARD_PRESETS, type BoardPreset } from '../engine';

const KEYS = {
  highScore: '@plink/highScore',
  settings: '@plink/settings',
  onboardingDone: '@plink/onboardingDone',
} as const;

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
  showTileLetters: boolean;
  /** Max undo steps retained (moodboard Settings inventory). */
  undoLimit: number;
  /** Preferred board size for New Game default. */
  defaultBoardPreset: BoardPreset;
}

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'en',
  showTileLetters: true,
  undoLimit: 3,
  defaultBoardPreset: '12x14',
};

function normalizeBoardPreset(value: unknown): BoardPreset {
  if (typeof value === 'string' && value in BOARD_PRESETS) {
    return value as BoardPreset;
  }
  return DEFAULT_SETTINGS.defaultBoardPreset;
}

export async function getHighScore(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.highScore);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function setHighScore(score: number): Promise<void> {
  try {
    const current = await getHighScore();
    if (score > current) {
      await AsyncStorage.setItem(KEYS.highScore, String(score));
    }
  } catch {
    // ignore persistence errors in MVP
  }
}

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      defaultBoardPreset: normalizeBoardPreset(parsed.defaultBoardPreset),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export async function isOnboardingDone(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEYS.onboardingDone)) === '1';
  } catch {
    return false;
  }
}

export async function setOnboardingDone(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.onboardingDone, '1');
  } catch {
    // ignore
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.highScore, KEYS.onboardingDone]);
  } catch {
    // ignore
  }
}
