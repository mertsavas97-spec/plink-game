/**
 * Board layout math checks for common phone sizes (no RN runtime).
 * Mirrors src/theme/boardLayout.ts
 */

const layout = {
  boardScreenMargin: 16,
  boardPad: 8,
  tileGapRatio: 0.06,
  minTile: 24,
  maxTile: 72,
  chromeTop: 56,
  chromeBottom: 80,
};

function computeBoardLayout({
  screenW,
  screenH,
  cols,
  rows,
  topChrome,
  bottomChrome,
}) {
  const boardPad = layout.boardPad;
  const gapRatio = layout.tileGapRatio;
  const screenMargin = layout.boardScreenMargin;
  const availW = Math.max(0, screenW - screenMargin * 2 - boardPad * 2);
  const availH = Math.max(0, screenH - topChrome - bottomChrome - boardPad * 2);
  const pitchFactor = 1 + gapRatio;
  let tileSize = Math.min(
    layout.maxTile,
    Math.min(Math.floor(availW / (cols * pitchFactor)), Math.floor(availH / (rows * pitchFactor))),
  );
  tileSize = Math.max(16, tileSize);
  let gap = Math.max(1, Math.round(tileSize * gapRatio));
  const maxPanelInner = screenW - screenMargin * 2 - boardPad * 2;
  while (cols * (tileSize + gap) > maxPanelInner && tileSize > 16) {
    tileSize -= 1;
    gap = Math.max(1, Math.round(tileSize * gapRatio));
  }
  const panelWidth = cols * (tileSize + gap) + boardPad * 2;
  return {
    tileSize,
    gap,
    panelWidth,
    fits: panelWidth <= screenW - screenMargin * 2 + 0.5,
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const sizes = [
  { w: 375, h: 667, name: 'iPhone SE' },
  { w: 390, h: 844, name: 'iPhone 12/13' },
  { w: 430, h: 932, name: 'iPhone 14/15 Pro Max' },
];

for (const s of sizes) {
  const top = 47 + layout.chromeTop; // approx safe top
  const bottom = 34 + layout.chromeBottom;
  for (const [cols, rows, label] of [
    [10, 10, '10x10'],
    [12, 14, '12x14'],
    [16, 18, '16x18'],
  ]) {
    const r = computeBoardLayout({
      screenW: s.w,
      screenH: s.h,
      cols,
      rows,
      topChrome: top,
      bottomChrome: bottom,
    });
    assert(r.fits, `${s.name} ${label}: panel ${r.panelWidth} overflows ${s.w}`);
    assert(r.tileSize >= 16, `${s.name} ${label}: tile too small`);
    const margin = (s.w - r.panelWidth) / 2;
    assert(margin >= layout.boardScreenMargin - 0.5, `${s.name} ${label}: margin ${margin}`);
    console.log(
      `${s.name} ${label}: tile=${r.tileSize} gap=${r.gap} panelW=${r.panelWidth} margin≈${margin.toFixed(1)}`,
    );
  }
}

console.log('layout-check: ok');
