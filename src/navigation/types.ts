import type { ColorCount, BoardPreset } from '../engine';

export type RootStackParamList = {
  Onboarding: undefined;
  MainMenu: undefined;
  NewGame: undefined;
  Game: { colorCount: ColorCount; boardPreset: BoardPreset };
  GameOver: {
    score: number;
    best: number;
    isNewHigh: boolean;
    won: boolean;
    colorCount: ColorCount;
    boardPreset: BoardPreset;
  };
  Settings: undefined;
  ComingSoon: { feature: string };
};
