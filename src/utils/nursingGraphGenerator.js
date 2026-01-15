/**
 * ═══════════════════════════════════════════════════════════════════
 * NURSING BUILDING GRAPH GENERATOR (FIXED)
 * ═══════════════════════════════════════════════════════════════════
 * * FILE LOCATION: src/utils/nursingGraphGenerator.js
 * * FIXES:
 * * ✅ Hallway nodes generated every 50px (was 100px) to ensure connections
 * * ✅ Rooms now snap to nearest 50px grid
 * * ✅ Ensures "Nursing Room N101" etc. are connected to the main graph
 * ═══════════════════════════════════════════════════════════════════
 */

import { 
  NURSING_FLOORS, 
  NURSING_HALL_Y,
  NURSING_FLOOR_CONFIG,
  NURSING_ROOM_START_X,
  NURSING_ROOM_SPACING,
  NURSING_ROOM_Y
} from '../constants/nursingBuildingConfig';

export const generateNursingBuildingGraph = () => {
  let nodes = {};

  for (let f = 0; f < NURSING_FLOORS; f++) {
    const floorNum = f + 1;
    const floorPrefix = `NF${floorNum}`;
    
    // 1. STAIRS
    const stairLeftId = `${floorPrefix}_StairL`;
    const stairRightId = `${floorPrefix}_StairR`;

    nodes[stairLeftId] = { id: stairLeftId, x: 50, y: NURSING_HALL_Y, floor: f, building: 'nursing', type: 'stair', neighbors: [] };
    nodes[stairRightId] = { id: stairRightId, x: 950, y: NURSING_HALL_Y, floor: f, building: 'nursing', type: 'stair', neighbors: [] };

    // Connect stairs vertically
    if (f > 0) {
      const prevFloorPrefix = `NF${f}`;
      nodes[stairLeftId].neighbors.push(`${prevFloorPrefix}_StairL`);
      nodes[`${prevFloorPrefix}_StairL`].neighbors.push(stairLeftId);
      
      nodes[stairRightId].neighbors.push(`${prevFloorPrefix}_StairR`);
      nodes[`${prevFloorPrefix}_StairR`].neighbors.push(stairRightId);
    }

    // 2. HALLWAY (✅ UPDATED: Spacing = 50 to catch all rooms)
    let prevHallId = stairLeftId;

    for (let x = 100; x <= 900; x += 50) {
      const hallId = `${floorPrefix}_Hall_${x}`;
      
      nodes[hallId] = { 
        id: hallId, 
        x: x, 
        y: NURSING_HALL_Y, 
        floor: f, 
        building: 'nursing',
        type: 'hall', 
        neighbors: [prevHallId] 
      };
      
      nodes[prevHallId].neighbors.push(hallId);
      prevHallId = hallId;
    }

    nodes[prevHallId].neighbors.push(stairRightId);
    nodes[stairRightId].neighbors.push(prevHallId);

    // 3. ROOMS / LIBRARY
    const floorConfig = NURSING_FLOOR_CONFIG[floorNum];

    if (floorConfig.type === 'library') {
      const libraryId = `Nursing Library`;
      nodes[libraryId] = {
        id: libraryId,
        x: 500,
        y: NURSING_ROOM_Y,
        floor: f,
        building: 'nursing',
        type: 'library',
        label: 'LIBRARY',
        neighbors: [`${floorPrefix}_Hall_500`] // Connects to center hall
      };
      if (nodes[`${floorPrefix}_Hall_500`]) nodes[`${floorPrefix}_Hall_500`].neighbors.push(libraryId);

    } else if (floorConfig.type === 'classroom') {
      for (let roomIdx = 0; roomIdx < floorConfig.rooms; roomIdx++) {
        const roomNum = `N${floorNum}0${roomIdx + 1}`;
        const roomId = `Nursing Room ${roomNum}`;
        const roomX = NURSING_ROOM_START_X + (roomIdx * NURSING_ROOM_SPACING);
        
        // ✅ UPDATED: Snap to nearest 50px (matches hall generation)
        const nearestHallX = Math.round(roomX / 50) * 50;
        const nearestHallId = `${floorPrefix}_Hall_${nearestHallX}`;
        
        nodes[roomId] = {
          id: roomId,
          x: roomX,
          y: NURSING_ROOM_Y,
          floor: f,
          building: 'nursing',
          type: 'room',
          label: roomNum,
          neighbors: [nearestHallId]
        };
        
        if (nodes[nearestHallId]) {
          nodes[nearestHallId].neighbors.push(roomId);
        } else {
          console.warn(`⚠️ Orphaned Room ${roomId} (Target Hall: ${nearestHallId})`);
        }
      }
    }
  }

  // 4. ENTRANCE
  const entranceId = "Nursing Entrance";
  nodes[entranceId] = {
    id: entranceId,
    x: 500,
    y: 350,
    floor: 0,
    building: 'nursing',
    type: 'entrance',
    label: 'ENTRANCE',
    neighbors: ['NF1_Hall_500'] // Connects to center of Floor 1 (Ground)
  };
  
  if (nodes['NF1_Hall_500']) nodes['NF1_Hall_500'].neighbors.push(entranceId);

  return nodes;
};