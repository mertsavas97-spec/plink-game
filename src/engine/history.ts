import type { GameSnapshot } from './types';

/** Undo/redo stack for full game snapshots. */
export class HistoryStack {
  private past: GameSnapshot[] = [];
  private future: GameSnapshot[] = [];
  private maxPast: number | null;

  constructor(maxPast: number | null = null) {
    this.maxPast = maxPast != null && maxPast > 0 ? maxPast : null;
  }

  setMaxPast(maxPast: number | null): void {
    this.maxPast = maxPast != null && maxPast > 0 ? maxPast : null;
    this.trim();
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }

  get canRedo(): boolean {
    return this.future.length > 0;
  }

  push(currentBeforeChange: GameSnapshot): void {
    this.past.push(currentBeforeChange);
    this.future = [];
    this.trim();
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
    this.trim();
    return next;
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }

  private trim(): void {
    if (this.maxPast == null) return;
    while (this.past.length > this.maxPast) {
      this.past.shift();
    }
  }
}
