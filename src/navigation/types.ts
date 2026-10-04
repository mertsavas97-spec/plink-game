import type { ColorCount, BoardPreset } from '../engine';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainMenu: undefined;
  NewGame: undefined;
  Game: {
    colorCount: ColorCount;
    boardPreset: BoardPreset;
    daily?: boolean;
    seed?: number;
  };
  GameOver: {
    score: number;
    best: number;
    isNewHigh: boolean;
    won: boolean;
    colorCount: ColorCount;
    boardPreset: BoardPreset;
    daily?: boolean;
  };
  Settings: undefined;
  Language: undefined;
  DailyPuzzle: undefined;
  Challenges: undefined;
  Themes: undefined;
};
