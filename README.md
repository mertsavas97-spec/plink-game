# PLINK

Modern Same Game–style puzzle for React Native (Expo). Classic orthogonal clusters, gravity + column collapse, Same Game–inspired scoring.

## Run

```bash
npm install
npx expo start
```

Then open in Expo Go (iOS/Android) or press `w` for web.

## Project layout

- `src/engine/` — board, clusters, scoring, undo/redo (UI-independent)
- `src/screens/` — Main Menu, New Game, Gameplay, Game Over, Onboarding, Settings
- `src/components/` — board, tiles, buttons, logo
- `src/storage/` — high score + settings (AsyncStorage)

## Classic mode (MVP)

- Board sizes: 10×10, 12×14, 16×18
- Colors: 3 / 4 / 5
- Selectable cluster ≥ 2; score only for size > 2
- Undo / redo / hint
- High score persisted locally
