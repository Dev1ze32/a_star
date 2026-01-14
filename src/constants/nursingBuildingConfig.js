export const NURSING_FLOORS = 4;
export const NURSING_BUILDING_WIDTH = 1000;
export const NURSING_BUILDING_HEIGHT = 400;
export const NURSING_HALL_Y = 280; // Hallway at bottom (single-sided)

// Room configuration per floor
export const NURSING_FLOOR_CONFIG = {
  1: { rooms: 5, type: 'classroom' },      // Floor 1: 5 rooms
  2: { rooms: 0, type: 'library' },        // Floor 2: Library (no individual rooms)
  3: { rooms: 5, type: 'classroom' },      // Floor 3: 5 rooms
  4: { rooms: 5, type: 'classroom' }       // Floor 4: 5 rooms
};

// Room spacing
export const NURSING_ROOM_START_X = 200;
export const NURSING_ROOM_SPACING = 150;
export const NURSING_ROOM_Y = 120; // Rooms at top (above hallway)