import type { GameSnapshot } from './types';

/** Undo/redo stack for full game snapshots. */
export class HistoryStack {
  private past: GameSnapshot[] = [];
  private future: GameSnapshot[] = [];

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  push(currentBeforeChange: GameSnapshot): void {
    this.past.push(currentBeforeChange);
    this.future = [];
  }

  undo(current: GameSnapshot): GameSnapshot | null {
    if (!this.canUndo) return null;
    const prev = this.past.pop()!;
    this.future.push(current);
    return prev;
  }

  redo(current: GameSnapshot): GameSnapshot | null {
    if (!this.canRedo) return null;
    const next = this.future.pop()!;
    this.past.push(current);
    return next;
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }
}
