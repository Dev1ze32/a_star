/**
 * ═══════════════════════════════════════════════════════════════════
 * NURSING BUILDING GRAPH GENERATOR (FIXED VERSION)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/utils/nursingGraphGenerator.js
 * 
 * FIXES APPLIED:
 * ✅ Fixed room ID collision (Nursing rooms now use unique IDs)
 * ✅ Removed duplicate entrance node
 * ✅ Added "building: 'nursing'" to ALL nodes
 * ✅ Fixed entrance connection to match existing node name
 * 
 * ROOM NUMBERING:
 * - Ground Floor (0): Nursing Entrance at bottom
 * - Floor 1: Rooms N101, N102, N103, N104, N105
 * - Floor 2: Library (single large space)
 * - Floor 3: Rooms N301, N302, N303, N304, N305
 * - Floor 4: Rooms N401, N402, N403, N404, N405
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import { 
  NURSING_FLOORS, 
  NURSING_BUILDING_WIDTH, 
  NURSING_BUILDING_HEIGHT,
  NURSING_HALL_Y,
  NURSING_FLOOR_CONFIG,
  NURSING_ROOM_START_X,
  NURSING_ROOM_SPACING,
  NURSING_ROOM_Y
} from '../constants/nursingBuildingConfig';

export const generateNursingBuildingGraph = () => {
  let nodes = {};

  // ═════════════════════════════════════════════════════════════════
  // GENERATE FLOORS (1-4, stored as 0-3 internally)
  // ═════════════════════════════════════════════════════════════════
  for (let f = 0; f < NURSING_FLOORS; f++) {
    const floorNum = f + 1; // Display floor: 1, 2, 3, 4
    const floorPrefix = `NF${floorNum}`;
    
    // ---------------------------------------------------------
    // 1. STAIRS GENERATION (Left and Right only)
    // ---------------------------------------------------------
    const stairLeftId = `${floorPrefix}_StairL`;
    const stairRightId = `${floorPrefix}_StairR`;

    // ✅ FIXED: Added "building: 'nursing'" to stairs
    nodes[stairLeftId] = { 
      id: stairLeftId, 
      x: 50, 
      y: NURSING_HALL_Y, 
      floor: f, 
      building: 'nursing',  // ← ADDED
      type: 'stair', 
      neighbors: [] 
    };
    
    nodes[stairRightId] = { 
      id: stairRightId, 
      x: 950, 
      y: NURSING_HALL_Y, 
      floor: f, 
      building: 'nursing',  // ← ADDED
      type: 'stair', 
      neighbors: [] 
    };

    // Connect stairs vertically
    if (f > 0) {
      const prevFloorPrefix = `NF${f}`;
      nodes[stairLeftId].neighbors.push(`${prevFloorPrefix}_StairL`);
      nodes[`${prevFloorPrefix}_StairL`].neighbors.push(stairLeftId);
      
      nodes[stairRightId].neighbors.push(`${prevFloorPrefix}_StairR`);
      nodes[`${prevFloorPrefix}_StairR`].neighbors.push(stairRightId);
    }

    // ---------------------------------------------------------
    // 2. HALLWAY GENERATION (Single corridor at bottom)
    // ---------------------------------------------------------
    let prevHallId = stairLeftId;

    for (let x = 150; x <= 850; x += 100) {
      const hallId = `${floorPrefix}_Hall_${x}`;
      
      // ✅ FIXED: Added "building: 'nursing'" to hallways
      nodes[hallId] = { 
        id: hallId, 
        x: x, 
        y: NURSING_HALL_Y, 
        floor: f, 
        building: 'nursing',  // ← ADDED
        type: 'hall', 
        neighbors: [prevHallId] 
      };
      
      nodes[prevHallId].neighbors.push(hallId);
      prevHallId = hallId;
    }

    // Connect last hallway to right stair
    nodes[prevHallId].neighbors.push(stairRightId);
    nodes[stairRightId].neighbors.push(prevHallId);

    // ---------------------------------------------------------
    // 3. ROOM/LIBRARY GENERATION (Based on floor config)
    // ---------------------------------------------------------
    const floorConfig = NURSING_FLOOR_CONFIG[floorNum];

    if (floorConfig.type === 'library') {
      // Floor 2: Single large library space
      const libraryId = `Nursing Library`; // ✅ Unique name
      
      // ✅ FIXED: Added "building: 'nursing'"
      nodes[libraryId] = {
        id: libraryId,
        x: 500, // Center of building
        y: NURSING_ROOM_Y,
        floor: f,
        building: 'nursing',  // ← ADDED
        type: 'library',
        label: 'LIBRARY',
        neighbors: [`${floorPrefix}_Hall_450`] // Connect to middle hallway
      };
      
      if (nodes[`${floorPrefix}_Hall_450`]) {
        nodes[`${floorPrefix}_Hall_450`].neighbors.push(libraryId);
      }

    } else if (floorConfig.type === 'classroom') {
      // Floors 1, 3, 4: Individual rooms
      for (let roomIdx = 0; roomIdx < floorConfig.rooms; roomIdx++) {
        // ✅ FIXED: Use "N" prefix to avoid collision with Main Building
        // N101, N102, N103... for Floor 1
        // N301, N302, N303... for Floor 3
        // N401, N402, N403... for Floor 4
        const roomNum = `N${floorNum}0${roomIdx + 1}`; // N101, N102, etc.
        const roomId = `Nursing Room ${roomNum}`;
        const roomX = NURSING_ROOM_START_X + (roomIdx * NURSING_ROOM_SPACING);
        
        // ✅ FIXED: Snap to hallway positions correctly
        const nearestHallX = Math.round(roomX / 100) * 100;
        const nearestHallId = `${floorPrefix}_Hall_${nearestHallX}`;
        
        // ✅ FIXED: Added "building: 'nursing'"
        nodes[roomId] = {
          id: roomId,
          x: roomX,
          y: NURSING_ROOM_Y,
          floor: f,
          building: 'nursing',  // ← ADDED
          type: 'room',
          label: roomNum,  // Display as "N101" not full ID
          neighbors: [nearestHallId]
        };
        
        // Connect hallway back to room
        if (nodes[nearestHallId]) {
          nodes[nearestHallId].neighbors.push(roomId);
        } else {
          console.warn(`⚠️ Nursing room ${roomId} couldn't connect to ${nearestHallId}`);
        }
      }
    }
  }

  // ═════════════════════════════════════════════════════════════════
  // 4. SPECIAL NODES - ENTRANCE (Ground floor)
  // ═════════════════════════════════════════════════════════════════
  
  // ✅ FIXED: Use existing "Nursing Entrance" node name from original code
  // This matches what's already in your system
  const entranceId = "Nursing Entrance";
  
  // ✅ FIXED: Added "building: 'nursing'"
  nodes[entranceId] = {
    id: entranceId,
    x: 500,
    y: 350,
    floor: 0,
    building: 'nursing',  // ← ADDED
    type: 'entrance',
    label: 'ENTRANCE',
    neighbors: ['NF1_Hall_450', 'NF1_Hall_550'] // Connect to nearby hallways
  };
  
  // Connect hallways to entrance
  if (nodes['NF1_Hall_450']) {
    nodes['NF1_Hall_450'].neighbors.push(entranceId);
  }
  if (nodes['NF1_Hall_550']) {
    nodes['NF1_Hall_550'].neighbors.push(entranceId);
  }

  console.log('✅ Nursing Building graph generated:', Object.keys(nodes).length, 'nodes');
  
  return nodes;
};