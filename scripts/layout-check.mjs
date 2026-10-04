/**
 * Board layout math checks for common phone sizes (no RN runtime).
 * Mirrors src/theme/boardLayout.ts
 */

const layout = {
  boardScreenMargin: 16,
  boardPad: 8,
  tileGapPx: 2,
  minTile: 30,
  maxTile: 72,
  chromeTop: 64,
  chromeBottom: 104,
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
  const gap = layout.tileGapPx;
  const screenMargin = layout.boardScreenMargin;
  const availH = Math.max(0, screenH - topChrome - bottomChrome);
  const byW = Math.floor(
    (screenW - screenMargin * 2 - boardPad * 2 - (cols - 1) * gap) / cols,
  );
  const byH = Math.floor(
    (availH - boardPad * 2 - (rows - 1) * gap) / rows,
  );
  let tileSize = Math.max(1, Math.min(layout.maxTile, Math.min(byW, byH)));
  const maxInnerW = screenW - screenMargin * 2 - boardPad * 2;
  while (cols * tileSize + (cols - 1) * gap > maxInnerW && tileSize > 1) {
    tileSize -= 1;
  }
  const panelWidth = cols * tileSize + (cols - 1) * gap + boardPad * 2;
  return {
    tileSize,
    gap,
    panelWidth,
    fits: panelWidth <= screenW - screenMargin * 2 + 0.5,
    meetsMin: tileSize >= layout.minTile,
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const sizes = [
  { w: 375, h: 667, name: 'iPhone SE (375×667)' },
  { w: 390, h: 844, name: 'iPhone 12/13 (390×844)' },
  { w: 430, h: 932, name: 'iPhone 14/15 Pro Max (430×932)' },
];

const presets = [
  [8, 12, '8x12 Small'],
  [10, 14, '10x14 Medium'],
  [10, 16, '10x16 Large'],
];

console.log('=== PLINK tile size report ===');
for (const s of sizes) {
  const top = 47 + layout.chromeTop;
  const bottom = 34 + layout.chromeBottom;
  for (const [cols, rows, label] of presets) {
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
    assert(
      margin >= layout.boardScreenMargin - 0.5,
      `${s.name} ${label}: margin ${margin}`,
    );
    const minNote = r.meetsMin ? 'OK' : `FALLBACK needed (<${layout.minTile})`;
    console.log(
      `${s.name} | ${label}: tile=${r.tileSize}pt gap=${r.gap} panelW=${r.panelWidth} margin≈${margin.toFixed(1)} [${minNote}]`,
    );
  }
}

console.log('layout-check: ok');
