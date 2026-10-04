import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOARD_PRESETS, type BoardPreset } from '../engine';

const KEYS = {
  highScore: '@plink/highScore',
  settings: '@plink/settings',
  onboardingDone: '@plink/onboardingDone',
  daily: '@plink/daily',
  challenges: '@plink/challenges',
} as const;

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
  showTileLetters: boolean;
  undoLimit: number;
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

export type ChallengeId =
  | 'clear100'
  | 'score50k'
  | 'under2min'
  | 'undo3';

export interface ChallengeProgress {
  clear100: number;
  score50k: number;
  under2min: number;
  undo3: number;
}

export const CHALLENGE_TARGETS: Record<ChallengeId, number> = {
  clear100: 100,
  score50k: 50000,
  under2min: 1,
  undo3: 3,
};

export const DEFAULT_CHALLENGES: ChallengeProgress = {
  clear100: 0,
  score50k: 0,
  under2min: 0,
  undo3: 0,
};

export interface DailyState {
  dateKey: string;
  bestScore: number;
  played: boolean;
}

function normalizeBoardPreset(value: unknown): BoardPreset {
  if (typeof value === 'string' && value in BOARD_PRESETS) {
    return value as BoardPreset;
  }
  return DEFAULT_SETTINGS.defaultBoardPreset;
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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
    // ignore
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

export async function getDailyState(): Promise<DailyState> {
  const key = todayKey();
  try {
    const raw = await AsyncStorage.getItem(KEYS.daily);
    if (!raw) return { dateKey: key, bestScore: 0, played: false };
    const parsed = JSON.parse(raw) as DailyState;
    if (parsed.dateKey !== key) {
      return { dateKey: key, bestScore: 0, played: false };
    }
    return parsed;
  } catch {
    return { dateKey: key, bestScore: 0, played: false };
  }
}

export async function saveDailyState(state: DailyState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.daily, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export async function getChallenges(): Promise<ChallengeProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.challenges);
    if (!raw) return { ...DEFAULT_CHALLENGES };
    return { ...DEFAULT_CHALLENGES, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CHALLENGES };
  }
}

export async function saveChallenges(p: ChallengeProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.challenges, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.highScore,
      KEYS.onboardingDone,
      KEYS.daily,
      KEYS.challenges,
    ]);
  } catch {
    // ignore
  }
}

/** Seeded RNG from YYYY-MM-DD for daily boards. */
export function dateSeed(dateKey: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
