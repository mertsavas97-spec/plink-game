import { clearPositions, cloneBoard, createBoard, isBoardEmpty } from './board';
import { findCluster, hasValidMoves, hintCluster, isSelectableCluster } from './cluster';
import { clearBoardBonus, clusterScore, timeBonus } from './scoring';
import { HistoryStack } from './history';
import type { Board, GameConfig, GameSnapshot, GameStatus, Position } from './types';

function snapshotOf(
  board: Board,
  score: number,
  moves: number,
  startedAtMs: number,
  elapsedMs: number,
  config: GameConfig,
  status: GameStatus,
): GameSnapshot {
  return {
    board: cloneBoard(board),
    score,
    moves,
    startedAtMs,
    elapsedMs,
    config: { ...config, boardSize: { ...config.boardSize } },
    status,
  };
}

function resolveStatus(board: Board): GameStatus {
  if (isBoardEmpty(board)) return 'won';
  if (!hasValidMoves(board)) return 'lost';
  return 'playing';
}

export class GameEngine {
  private board: Board;
  private score = 0;
  private moves = 0;
  private startedAtMs: number;
  private pausedAccumulatedMs = 0;
  private pauseStartedAt: number | null = null;
  private status: GameStatus = 'playing';
  private config: GameConfig;
  private history: HistoryStack;
  private endBonusesApplied = false;
  private frozenElapsedMs: number | null = null;

  constructor(config: GameConfig, nowMs = Date.now(), undoLimit: number | null = null) {
    this.config = config;
    this.board = createBoard(config);
    this.startedAtMs = nowMs;
    this.history = new HistoryStack(undoLimit);
    this.status = resolveStatus(this.board);
  }

  setUndoLimit(limit: number | null): void {
    this.history.setMaxPast(limit);
  }

  static fromSnapshot(snap: GameSnapshot): GameEngine {
    const engine = new GameEngine(snap.config, snap.startedAtMs);
    engine.board = cloneBoard(snap.board);
    engine.score = snap.score;
    engine.moves = snap.moves;
    engine.startedAtMs = snap.startedAtMs;
    engine.pausedAccumulatedMs = 0;
    engine.pauseStartedAt = null;
    // Reconstruct elapsed by setting startedAt relative to now so getElapsedMs matches
    engine.pausedAccumulatedMs = 0;
    engine.startedAtMs = Date.now() - snap.elapsedMs;
    engine.status = snap.status;
    engine.endBonusesApplied = snap.status !== 'playing';
    engine.frozenElapsedMs = snap.status !== 'playing' ? snap.elapsedMs : null;
    engine.history.clear();
    return engine;
  }

  getSnapshot(nowMs = Date.now()): GameSnapshot {
    return snapshotOf(
      this.board,
      this.score,
      this.moves,
      this.startedAtMs,
      this.getElapsedMs(nowMs),
      this.config,
      this.status,
    );
  }

  getBoard(): Board {
    return this.board;
  }

  getScore(): number {
    return this.score;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getConfig(): GameConfig {
    return this.config;
  }

  getMoves(): number {
    return this.moves;
  }

  canUndo(): boolean {
    return this.history.canUndo;
  }

  canRedo(): boolean {
    return this.history.canRedo;
  }

  getElapsedMs(nowMs = Date.now()): number {
    if (this.frozenElapsedMs != null) return this.frozenElapsedMs;
    if (this.pauseStartedAt != null) {
      return this.pauseStartedAt - this.startedAtMs - this.pausedAccumulatedMs;
    }
    return nowMs - this.startedAtMs - this.pausedAccumulatedMs;
  }

  pause(nowMs = Date.now()): void {
    if (this.pauseStartedAt != null || this.status !== 'playing') return;
    this.pauseStartedAt = nowMs;
  }

  resume(nowMs = Date.now()): void {
    if (this.pauseStartedAt == null) return;
    this.pausedAccumulatedMs += nowMs - this.pauseStartedAt;
    this.pauseStartedAt = null;
  }

  getClusterAt(pos: Position): Position[] {
    return findCluster(this.board, pos);
  }

  /** Preview selection; returns null if not selectable. */
  select(pos: Position): Position[] | null {
    const cluster = findCluster(this.board, pos);
    if (!isSelectableCluster(cluster)) return null;
    return cluster;
  }

  clearCluster(cluster: Position[], nowMs = Date.now()): number {
    if (this.status !== 'playing' || this.pauseStartedAt != null) return 0;
    if (!isSelectableCluster(cluster)) return 0;

    this.history.push(this.getSnapshot(nowMs));

    const points = clusterScore(cluster.length, this.config.colorCount);
    this.board = clearPositions(this.board, cluster);
    this.score += points;
    this.moves += 1;
    this.status = resolveStatus(this.board);

    if (this.status !== 'playing') {
      this.applyEndBonuses(nowMs);
    }

    return points;
  }

  clearAt(pos: Position, nowMs = Date.now()): number {
    const cluster = this.select(pos);
    if (!cluster) return 0;
    return this.clearCluster(cluster, nowMs);
  }

  undo(nowMs = Date.now()): boolean {
    const current = this.getSnapshot(nowMs);
    const prev = this.history.undo(current);
    if (!prev) return false;
    this.applySnapshot(prev, nowMs);
    return true;
  }

  redo(nowMs = Date.now()): boolean {
    const current = this.getSnapshot(nowMs);
    const next = this.history.redo(current);
    if (!next) return false;
    this.applySnapshot(next, nowMs);
    return true;
  }

  getHint(): Position[] | null {
    return hintCluster(this.board);
  }

  private applySnapshot(snap: GameSnapshot, nowMs: number): void {
    this.board = cloneBoard(snap.board);
    this.score = snap.score;
    this.moves = snap.moves;
    this.config = snap.config;
    this.status = snap.status;
    this.endBonusesApplied = snap.status !== 'playing';
    this.frozenElapsedMs = snap.status !== 'playing' ? snap.elapsedMs : null;
    // Keep wall-clock continuity: set startedAt so elapsed matches snapshot
    const elapsed = snap.elapsedMs;
    if (this.pauseStartedAt != null) {
      this.pauseStartedAt = null;
    }
    this.pausedAccumulatedMs = 0;
    this.startedAtMs = nowMs - elapsed;
  }

  private applyEndBonuses(nowMs: number): void {
    if (this.endBonusesApplied) return;
    this.endBonusesApplied = true;
    const cleared = isBoardEmpty(this.board);
    const elapsedSec = this.getElapsedMs(nowMs) / 1000;
    this.frozenElapsedMs = this.getElapsedMs(nowMs);
    const { rows, cols } = this.config.boardSize;
    if (cleared) {
      this.score += clearBoardBonus(this.config.colorCount);
      this.score += timeBonus(rows, cols, elapsedSec, this.config.colorCount, true);
    }
  }
}
