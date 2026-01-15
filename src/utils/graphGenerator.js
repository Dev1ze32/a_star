/**
 * ═══════════════════════════════════════════════════════════════════
 * MAIN BUILDING GRAPH GENERATOR (UPDATED FOR UNIFIED SYSTEM)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/utils/graphGenerator.js
 * 
 * CHANGES MADE:
 * - Added "building: 'main'" property to ALL nodes
 * - This allows the unified graph to identify which building each node belongs to
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import { FLOORS, ROOMS_PER_FLOOR, BUILDING_WIDTH, BUILDING_HEIGHT, HALL_Y } from '../constants/buildingConfig';

export const generateBuildingGraph = () => {
  let nodes = {};

  for (let f = 0; f < FLOORS; f++) {
    const floorPrefix = `F${f}`;
    
    // Generate stairs
    const stairs = generateStairs(floorPrefix, f, nodes);
    
    // Generate hallways and rooms
    generateHallwaysAndRooms(floorPrefix, f, stairs, nodes);
  }

  // Add special nodes
  addSpecialNodes(nodes);

  return nodes;
};

const generateStairs = (floorPrefix, floor, nodes) => {
  const stairLeftId = `${floorPrefix}_StairL`;
  const stairMidId = `${floorPrefix}_StairM`; 
  const stairRightId = `${floorPrefix}_StairR`;

  // ✅ CHANGED: Added "building: 'main'" to all stair nodes
  nodes[stairLeftId] = { 
    id: stairLeftId, 
    x: 50, 
    y: HALL_Y, 
    floor, 
    building: 'main',  // ← ADDED
    type: 'stair', 
    neighbors: [] 
  };
  
  nodes[stairMidId] = { 
    id: stairMidId, 
    x: 390, 
    y: 80, 
    floor, 
    building: 'main',  // ← ADDED
    type: 'stair', 
    neighbors: [] 
  }; 
  
  nodes[stairRightId] = { 
    id: stairRightId, 
    x: 950, 
    y: HALL_Y, 
    floor, 
    building: 'main',  // ← ADDED
    type: 'stair', 
    neighbors: [] 
  };

  if (floor > 0) {
    const prevFloorPrefix = `F${floor - 1}`;
    connectVerticalStairs(nodes, stairLeftId, stairMidId, stairRightId, prevFloorPrefix);
  }

  return { stairLeftId, stairMidId, stairRightId };
};

const connectVerticalStairs = (nodes, leftId, midId, rightId, prevPrefix) => {
  // Left
  nodes[leftId].neighbors.push(`${prevPrefix}_StairL`);
  nodes[`${prevPrefix}_StairL`].neighbors.push(leftId);
  // Middle
  nodes[midId].neighbors.push(`${prevPrefix}_StairM`);
  nodes[`${prevPrefix}_StairM`].neighbors.push(midId);
  // Right
  nodes[rightId].neighbors.push(`${prevPrefix}_StairR`);
  nodes[`${prevPrefix}_StairR`].neighbors.push(rightId);
};

const generateHallwaysAndRooms = (floorPrefix, floor, stairs, nodes) => {
  let roomCount = 0;
  let prevHallId = stairs.stairLeftId;

  for (let x = 150; x <= 850; x += 80) {
    const hallId = `${floorPrefix}_Hall_${x}`;
    
    // ✅ CHANGED: Added "building: 'main'" to all hallway nodes
    nodes[hallId] = { 
      id: hallId, 
      x, 
      y: HALL_Y, 
      floor, 
      building: 'main',  // ← ADDED
      type: 'hall', 
      neighbors: [prevHallId] 
    };
    
    nodes[prevHallId].neighbors.push(hallId);
    prevHallId = hallId;

    // Connect to middle stair
    if (Math.abs(x - 390) < 10) {
      nodes[hallId].neighbors.push(stairs.stairMidId);
      nodes[stairs.stairMidId].neighbors.push(hallId);
      continue; // Skip room generation at stair location
    }

    // Generate rooms
    if (floor === 0) {
      if (x !== 470 && roomCount < ROOMS_PER_FLOOR) {
        generateRoomPair(floor, x, roomCount, hallId, nodes);
        roomCount += 2;
      }
    } else {
      if (roomCount < ROOMS_PER_FLOOR) {
        generateRoomPair(floor, x, roomCount, hallId, nodes);
        roomCount += 2;
      }
    }
  }

  // Connect last hallway to right stair
  nodes[prevHallId].neighbors.push(stairs.stairRightId);
  nodes[stairs.stairRightId].neighbors.push(prevHallId);
};

const generateRoomPair = (floor, x, startCount, hallId, nodes) => {
  // ✅ CHANGED: Added "building: 'main'" to all room nodes
  
  // Top room
  const roomNumTop = (floor + 1) * 100 + startCount;
  const roomTopId = `Room ${roomNumTop}`;
  nodes[roomTopId] = { 
    id: roomTopId, 
    x, 
    y: 80, 
    floor, 
    building: 'main',  // ← ADDED
    type: 'room', 
    label: `${roomNumTop}`, 
    neighbors: [hallId] 
  };
  nodes[hallId].neighbors.push(roomTopId);

  // Bottom room
  const roomNumBot = (floor + 1) * 100 + startCount + 1;
  const roomBotId = `Room ${roomNumBot}`;
  nodes[roomBotId] = { 
    id: roomBotId, 
    x, 
    y: 320, 
    floor, 
    building: 'main',  // ← ADDED
    type: 'room', 
    label: `${roomNumBot}`, 
    neighbors: [hallId] 
  };
  nodes[hallId].neighbors.push(roomBotId);
};

const addSpecialNodes = (nodes) => {
  // ✅ CHANGED: Added "building: 'main'" to Kiosk
  const kioskId = "Kiosk";
  nodes[kioskId] = { 
    id: kioskId, 
    x: 480, 
    y: 320, 
    floor: 0, 
    building: 'main',  // ← ADDED
    type: 'kiosk', 
    label: "KIOSK", 
    neighbors: ["F0_Hall_470"] 
  };
  
  if (nodes["F0_Hall_470"]) {
    nodes["F0_Hall_470"].neighbors.push(kioskId);
  } else if (nodes["F0_Hall_390"]) {
    nodes[kioskId].neighbors = ["F0_Hall_390"];
    nodes["F0_Hall_390"].neighbors.push(kioskId);
  }

  // ✅ CHANGED: Added "building: 'main'" to Back Exit
  const backExitId = "Back Exit";
  nodes[backExitId] = { 
    id: backExitId, 
    x: 470, 
    y: 50, 
    floor: 0, 
    building: 'main',  // ← ADDED
    type: 'exit', 
    label: "EXIT", 
    neighbors: ["F0_Hall_470"] 
  };
  
  if (nodes["F0_Hall_470"]) {
    nodes["F0_Hall_470"].neighbors.push(backExitId);
  }
};