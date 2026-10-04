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
  CHALLENGE_TARGETS,
  DEFAULT_CHALLENGES,
  DEFAULT_SETTINGS,
  getChallenges,
  getDailyState,
  getHighScore,
  getSettings,
  isOnboardingDone,
  resetProgress,
  saveChallenges,
  saveDailyState,
  saveSettings,
  setHighScore as persistHighScore,
  setOnboardingDone,
  todayKey,
  type ChallengeProgress,
  type DailyState,
  type Settings,
} from '../storage/persistence';

export interface GameStatsEvent {
  score: number;
  tilesCleared: number;
  elapsedMs: number;
  undosUsed: number;
  won: boolean;
  daily?: boolean;
}

interface AppContextValue {
  ready: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  highScore: number;
  recordScore: (score: number) => Promise<boolean>;
  onboardingDone: boolean;
  completeOnboarding: () => Promise<void>;
  resetAllProgress: () => Promise<void>;
  daily: DailyState;
  challenges: ChallengeProgress;
  applyGameStats: (ev: GameStatsEvent) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [highScore, setHighScoreState] = useState(0);
  const [onboardingDone, setOnboardingDoneState] = useState(false);
  const [daily, setDaily] = useState<DailyState>({
    dateKey: todayKey(),
    bestScore: 0,
    played: false,
  });
  const [challenges, setChallenges] = useState<ChallengeProgress>({
    ...DEFAULT_CHALLENGES,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, hs, ob, d, c] = await Promise.all([
        getSettings(),
        getHighScore(),
        isOnboardingDone(),
        getDailyState(),
        getChallenges(),
      ]);
      if (cancelled) return;
      setSettings(s);
      setHighScoreState(hs);
      setOnboardingDoneState(ob);
      setDaily(d);
      setChallenges(c);
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
    const previousBest = await getHighScore();
    const isNew = score > previousBest;
    if (isNew) {
      setHighScoreState(score);
      await persistHighScore(score);
    }
    return isNew;
  }, []);

  const completeOnboarding = useCallback(async () => {
    setOnboardingDoneState(true);
    await setOnboardingDone();
  }, []);

  const applyGameStats = useCallback(async (ev: GameStatsEvent) => {
    setChallenges((prev) => {
      const next: ChallengeProgress = {
        clear100: Math.min(
          CHALLENGE_TARGETS.clear100,
          prev.clear100 + ev.tilesCleared,
        ),
        score50k: Math.max(prev.score50k, Math.min(CHALLENGE_TARGETS.score50k, ev.score)),
        under2min:
          ev.won && ev.elapsedMs <= 120_000
            ? Math.max(prev.under2min, 1)
            : prev.under2min,
        undo3: Math.min(CHALLENGE_TARGETS.undo3, Math.max(prev.undo3, ev.undosUsed)),
      };
      void saveChallenges(next);
      return next;
    });

    if (ev.daily) {
      setDaily((prev) => {
        const key = todayKey();
        const base = prev.dateKey === key ? prev : { dateKey: key, bestScore: 0, played: false };
        const next: DailyState = {
          dateKey: key,
          played: true,
          bestScore: Math.max(base.bestScore, ev.score),
        };
        void saveDailyState(next);
        return next;
      });
    }
  }, []);

  const resetAllProgress = useCallback(async () => {
    await resetProgress();
    setHighScoreState(0);
    setOnboardingDoneState(false);
    setDaily({ dateKey: todayKey(), bestScore: 0, played: false });
    setChallenges({ ...DEFAULT_CHALLENGES });
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
      daily,
      challenges,
      applyGameStats,
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
      daily,
      challenges,
      applyGameStats,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
