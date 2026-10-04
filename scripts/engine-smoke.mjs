/**
 * Lightweight smoke test for core engine rules (run with: node scripts/engine-smoke.mjs)
 * Mirrors logic in src/engine for CI-less verification.
 */

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clusterScore(n, colorCount) {
  if (n <= 2) return 0;
  const mult = { 3: 1, 4: 1.5, 5: 2 }[colorCount];
  return Math.round((n - 2) * (n - 2) * mult);
}

function createBoard(cols, rows, colorCount, seed) {
  const palette = ['A', 'B', 'C', 'D', 'E'].slice(0, colorCount);
  const rand = mulberry32(seed);
  return Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => palette[Math.floor(rand() * palette.length)]),
  );
}

function findCluster(board, origin) {
  const color = board[origin.col]?.[origin.row];
  if (!color) return [];
  const key = (c, r) => `${c},${r}`;
  const visited = new Set();
  const stack = [origin];
  const cluster = [];
  const ORTHO = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  while (stack.length) {
    const pos = stack.pop();
    const k = key(pos.col, pos.row);
    if (visited.has(k)) continue;
    visited.add(k);
    if (board[pos.col]?.[pos.row] !== color) continue;
    cluster.push(pos);
    for (const [dc, dr] of ORTHO) {
      const nc = pos.col + dc;
      const nr = pos.row + dr;
      if (nc >= 0 && nc < board.length && nr >= 0 && nr < board[0].length && !visited.has(key(nc, nr))) {
        stack.push({ col: nc, row: nr });
      }
    }
  }
  return cluster;
}

function applyGravity(board) {
  const rows = board[0].length;
  return board.map((col) => {
    const packed = col.filter((c) => c != null);
    return Array.from({ length: rows }, (_, r) => packed[r] ?? null);
  });
}

function collapseColumns(board) {
  const rows = board[0].length;
  const nonEmpty = board.filter((col) => col.some((c) => c != null));
  while (nonEmpty.length < board.length) nonEmpty.push(Array(rows).fill(null));
  return nonEmpty;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Scoring
assert(clusterScore(2, 3) === 0, 'size 2 scores 0');
assert(clusterScore(3, 3) === 1, 'size 3 / 3c => 1');
assert(clusterScore(5, 3) === 9, 'size 5 / 3c => 9');
assert(clusterScore(5, 5) === 18, 'size 5 / 5c => 18');

// Orthogonal cluster (no diagonals)
const board = [
  ['A', 'B'],
  ['B', 'A'],
];
assert(findCluster(board, { col: 0, row: 0 }).length === 1, 'diagonal A not connected');

const board2 = [
  ['A', 'A'],
  ['A', 'B'],
];
assert(findCluster(board2, { col: 0, row: 0 }).length === 3, 'ortho A cluster size 3');

// Gravity + collapse
let g = [
  [null, 'A', null],
  ['B', null, null],
  [null, null, null],
];
g = collapseColumns(applyGravity(g));
assert(g[0][0] === 'A', 'gravity packs A to bottom');
assert(g[1][0] === 'B', 'columns collapse left');
assert(g[2].every((c) => c == null), 'empty column on right');

const seeded = createBoard(10, 14, 4, 42);
assert(seeded.length === 10 && seeded[0].length === 14, 'seeded board size 10×14');
assert(seeded.every((col) => col.every((c) => 'ABCD'.includes(c))), 'palette 4');

// Rectangular boards (cols × rows) — Small / Medium / Large
const small = createBoard(8, 12, 3, 7);
assert(small.length === 8 && small[0].length === 12, '8×12 rectangular board');
const medium = createBoard(10, 14, 4, 11);
assert(medium.length === 10 && medium[0].length === 14, '10×14 rectangular board');
const large = createBoard(10, 16, 5, 99);
assert(large.length === 10 && large[0].length === 16, '10×16 rectangular board');
assert(Math.floor(Math.min(360 / 10, 480 / 14)) === 34, 'tile size uses min(W/cols, H/rows)');

console.log('engine-smoke: ok');
