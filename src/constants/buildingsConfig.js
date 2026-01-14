export const BUILDINGS = [
  {
    id: 'main',
    name: 'Main Building',
    x: 400,
    y: 300,
    width: 384,
    height: 320,
    color: 'slate',
    windows: 12,
    hasGraph: true
  },
  {
    id: 'bch',
    name: 'BCH Building',
    x: 100,
    y: 200,
    width: 300,
    height: 280,
    color: 'blue',
    windows: 9,
    hasGraph: true // ✅ CHANGED FROM false TO true
  },
  {
    id: 'nursing',
    name: 'Nursing Building',
    x: 750,
    y: 250,
    width: 320,
    height: 300,
    color: 'green',
    windows: 10,
    hasGraph: true
  }
];

export const CAMPUS_WIDTH = 1200;
export const CAMPUS_HEIGHT = 800;