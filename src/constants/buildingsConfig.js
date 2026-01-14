export const BUILDINGS = [
  {
    id: 'main',
    name: 'Main Building',
    x: 250,
    y: 445,
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
    y: 10,
    width: 300,
    height: 200,
    color: 'blue',
    windows: 9,
    hasGraph: true // ✅ CHANGED FROM false TO true
  },
  {
    id: 'nursing',
    name: 'Nursing Building',
    x: 680,
    y: 150,
    width: 400,
    height: 200,
    color: 'green',
    windows: 10,
    hasGraph: true
  }
];

export const CAMPUS_WIDTH = 1200;
export const CAMPUS_HEIGHT = 800;