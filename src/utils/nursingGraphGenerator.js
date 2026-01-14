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

  for (let f = 0; f < NURSING_FLOORS; f++) {
    const floorNum = f + 1; // Floor 1, 2, 3, 4 (not 0-indexed)
    const floorPrefix = `NF${floorNum}`;
    
    // ---------------------------------------------------------
    // 1. STAIRS GENERATION (Left and Right only)
    // ---------------------------------------------------------
    const stairLeftId = `${floorPrefix}_StairL`;
    const stairRightId = `${floorPrefix}_StairR`;

    nodes[stairLeftId] = { 
      id: stairLeftId, 
      x: 50, 
      y: NURSING_HALL_Y, 
      floor: f, 
      building: 'nursing',
      type: 'stair', 
      neighbors: [] 
    };
    
    nodes[stairRightId] = { 
      id: stairRightId, 
      x: 950, 
      y: NURSING_HALL_Y, 
      floor: f, 
      building: 'nursing',
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

    // Connect last hallway to right stair
    nodes[prevHallId].neighbors.push(stairRightId);
    nodes[stairRightId].neighbors.push(prevHallId);

    // ---------------------------------------------------------
    // 3. ROOM/LIBRARY GENERATION (Based on floor config)
    // ---------------------------------------------------------
    const floorConfig = NURSING_FLOOR_CONFIG[floorNum];

    if (floorConfig.type === 'library') {
      // Floor 2: Single large library space
      const libraryId = `${floorPrefix}_Library`;
      nodes[libraryId] = {
        id: libraryId,
        x: 500, // Center of building
        y: NURSING_ROOM_Y,
        floor: f,
        building: 'nursing',
        type: 'library',
        label: 'LIBRARY',
        neighbors: [`${floorPrefix}_Hall_450`] // Connect to middle hallway
      };
      
      if (nodes[`${floorPrefix}_Hall_450`]) {
        nodes[`${floorPrefix}_Hall_450`].neighbors.push(libraryId);
      }
    // ... inside generateNursingBuildingGraph

    } else if (floorConfig.type === 'classroom') {
      // Floors 1, 3, 4: Individual rooms
      for (let roomIdx = 0; roomIdx < floorConfig.rooms; roomIdx++) {
        const roomNum = floorNum * 100 + (roomIdx + 1); 
        const roomId = `Nursing Room ${roomNum}`;
        const roomX = NURSING_ROOM_START_X + (roomIdx * NURSING_ROOM_SPACING);
        
        // --- FIX START ---
        // Old (Broken): const nearestHallX = Math.round(roomX / 100) * 100;
        
        // New (Fixed): Snaps to 150, 250, 350... to match hallway loop
        const nearestHallX = Math.floor(roomX / 100) * 100 + 50; 
        // --- FIX END ---

        const nearestHallId = `${floorPrefix}_Hall_${nearestHallX}`;
        
        // Debugging tip: Check if connection is valid
        // console.log(`Connecting ${roomId} (x:${roomX}) to ${nearestHallId}`);

        nodes[roomId] = {
          id: roomId,
          x: roomX,
          y: NURSING_ROOM_Y,
          floor: f,
          building: 'nursing',
          type: 'room',
          label: `${roomNum}`,
          neighbors: [nearestHallId]
        };
        
        // Connect hallway back to room
        if (nodes[nearestHallId]) {
          nodes[nearestHallId].neighbors.push(roomId);
        } else {
            console.warn(`Orphaned Room: ${roomId} tried to connect to non-existent ${nearestHallId}`);
        }
      }
    }
  }

  // ---------------------------------------------------------
  // 4. SPECIAL NODES (Entrance)
  // ---------------------------------------------------------
  const entranceId = "Nursing Entrance";
  nodes[entranceId] = {
    id: entranceId,
    x: 500,
    y: 350,
    floor: 0,
    building: 'nursing',
    type: 'entrance',
    label: 'ENTRANCE',
    neighbors: ['NF1_Hall_450']
  };
  
  if (nodes['NF1_Hall_450']) {
    nodes['NF1_Hall_450'].neighbors.push(entranceId);
  }

  return nodes;
};