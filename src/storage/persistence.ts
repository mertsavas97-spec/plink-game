import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'en',
  showTileLetters: true,
};

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
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
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
