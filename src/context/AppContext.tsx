import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_SETTINGS,
  getHighScore,
  getSettings,
  isOnboardingDone,
  resetProgress,
  saveSettings,
  setHighScore as persistHighScore,
  setOnboardingDone,
  type Settings,
} from '../storage/persistence';

interface AppContextValue {
  ready: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  highScore: number;
  recordScore: (score: number) => Promise<boolean>;
  onboardingDone: boolean;
  completeOnboarding: () => Promise<void>;
  resetAllProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [highScore, setHighScoreState] = useState(0);
  const [onboardingDone, setOnboardingDoneState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, hs, ob] = await Promise.all([
        getSettings(),
        getHighScore(),
        isOnboardingDone(),
      ]);
      if (cancelled) return;
      setSettings(s);
      setHighScoreState(hs);
      setOnboardingDoneState(ob);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  const recordScore = useCallback(async (score: number) => {
    const isNew = score > highScore;
    if (isNew) {
      setHighScoreState(score);
      await persistHighScore(score);
    }
    return isNew;
  }, [highScore]);

  const completeOnboarding = useCallback(async () => {
    setOnboardingDoneState(true);
    await setOnboardingDone();
  }, []);

  const resetAllProgress = useCallback(async () => {
    await resetProgress();
    setHighScoreState(0);
    setOnboardingDoneState(false);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      settings,
      updateSettings,
      highScore,
      recordScore,
      onboardingDone,
      completeOnboarding,
      resetAllProgress,
    }),
    [
      ready,
      settings,
      updateSettings,
      highScore,
      recordScore,
      onboardingDone,
      completeOnboarding,
      resetAllProgress,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
