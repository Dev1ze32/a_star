export const BUILDINGS = [
  {
    id: 'main',
    name: 'Main Building',
    x: 250,
    y: 380, // ✅ MOVED UP (Was 465) to fit on screen
    width: 700,
    height: 280,
    color: 'slate',
    windows: 12,
    hasGraph: true
  },
  {
    id: 'bch',
    name: 'BCH Building',
    x: 280,
    y: 20, // Adjusted slightly
    width: 300,
    height: 200,
    color: 'blue',
    windows: 9,
    hasGraph: true
  },
  {
    id: 'nursing',
    name: 'Nursing Building',
    x: 680,
    y: 120, // Adjusted slightly
    width: 400,
    height: 200,
    color: 'green',
    windows: 10,
    hasGraph: true
  }
];

export const CAMPUS_WIDTH = 1200;
export const CAMPUS_HEIGHT = 700; // ✅ REDUCED HEIGHT (Was 800)