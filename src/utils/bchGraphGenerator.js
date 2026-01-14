import { 
  BCH_FLOORS,
  BCH_HALL_Y,
  BCH_ROOMS_PER_SIDE,
  BCH_ROOM_START_X,
  BCH_ROOM_START_X_RIGHT,
  BCH_ROOM_SPACING_LEFT,
  BCH_ROOM_SPACING_RIGHT,
  BCH_ROOM_TOP_Y,
  BCH_ROOM_BOTTOM_Y,
  BCH_STAIR_X,
  BCH_STAIR_Y,
  BCH_ELEVATOR_X,
  BCH_ELEVATOR_Y,
  BCH_ENTRANCE_X,
  BCH_ENTRANCE_Y,
  BCH_HALL_NODE_SPACING
} from '../constants/bchBuildingConfig';

export const generateBCHBuildingGraph = () => {
  let nodes = {};

  for (let floor = 0; floor < BCH_FLOORS; floor++) {
    const floorPrefix = `BCH_F${floor}`;
    
    // 1. STAIRS & ELEVATOR NODES
    const stairId = `${floorPrefix}_Stair`;
    const elevatorId = `${floorPrefix}_Elevator`;
    
    // ✅ Nodes created at new Top-Row Y position
    nodes[stairId] = { id: stairId, x: BCH_STAIR_X, y: BCH_STAIR_Y, floor, type: 'stair', neighbors: [] };
    nodes[elevatorId] = { id: elevatorId, x: BCH_ELEVATOR_X, y: BCH_ELEVATOR_Y, floor, type: 'elevator', neighbors: [] };

    // Connect vertically (Floor to Floor)
    if (floor > 0) {
      const prevPrefix = `BCH_F${floor - 1}`;
      nodes[stairId].neighbors.push(`${prevPrefix}_Stair`);
      nodes[`${prevPrefix}_Stair`].neighbors.push(stairId);
      
      nodes[elevatorId].neighbors.push(`${prevPrefix}_Elevator`);
      nodes[`${prevPrefix}_Elevator`].neighbors.push(elevatorId);
    }

    // 2. SINGLE HALLWAY GENERATION
    let prevHallId = null;
    
    // ✅ CRITICAL FIX: Start at 50 (not 60) to align with room logic (50, 100, 150...)
    for (let x = 50; x <= 1150; x += BCH_HALL_NODE_SPACING) {
      const hallId = `${floorPrefix}_Hall_${x}`;
      
      nodes[hallId] = {
        id: hallId,
        x: x,
        y: BCH_HALL_Y,
        floor: floor,
        type: 'hall',
        neighbors: prevHallId ? [prevHallId] : []
      };

      if (prevHallId) nodes[prevHallId].neighbors.push(hallId);
      
      // Connect Hallway to Stairs/Elevator (Vertical Connection)
      // Since Stairs are at Y=150 and Hall is Y=250, we connect if X aligns
      if (Math.abs(x - BCH_STAIR_X) < (BCH_HALL_NODE_SPACING / 1.5)) {
        nodes[hallId].neighbors.push(stairId);
        nodes[stairId].neighbors.push(hallId);
      }
      if (Math.abs(x - BCH_ELEVATOR_X) < (BCH_HALL_NODE_SPACING / 1.5)) {
        nodes[hallId].neighbors.push(elevatorId);
        nodes[elevatorId].neighbors.push(hallId);
      }

      prevHallId = hallId;
    }

    // 3. ROOM GENERATION
    const createRoom = (roomNum, x, y) => {
      const roomId = `BCH Room ${roomNum}`;
      // Find nearest hallway node (Rounding now matches the loop above)
      const nearestHallX = Math.round(x / BCH_HALL_NODE_SPACING) * BCH_HALL_NODE_SPACING;
      
      // Safety bounds
      let safeHallX = nearestHallX;
      if (safeHallX < 50) safeHallX = 50; 
      
      const hallId = `${floorPrefix}_Hall_${safeHallX}`;
      
      nodes[roomId] = {
        id: roomId,
        x: x,
        y: y,
        floor: floor,
        type: 'room',
        label: `${roomNum}`,
        neighbors: []
      };

      // Connect Room to Hallway
      if (nodes[hallId]) {
        nodes[roomId].neighbors.push(hallId);
        nodes[hallId].neighbors.push(roomId);
      } else {
        console.warn(`Orphaned Room: ${roomId} at X:${x} could not find Hall Node ${hallId}`);
      }
    };

    let roomCounter = 0;
    const floorNum = floor + 1; 

    // Left Wing
    for (let i = 0; i < BCH_ROOMS_PER_SIDE; i++) {
      const x = BCH_ROOM_START_X + (i * BCH_ROOM_SPACING_LEFT);
      createRoom(floorNum * 100 + (roomCounter * 2), x, BCH_ROOM_TOP_Y);      
      createRoom(floorNum * 100 + (roomCounter * 2) + 1, x, BCH_ROOM_BOTTOM_Y); 
      roomCounter++;
    }

    // Right Wing
    for (let i = 0; i < BCH_ROOMS_PER_SIDE; i++) {
      const x = BCH_ROOM_START_X_RIGHT + (i * BCH_ROOM_SPACING_RIGHT);
      createRoom(floorNum * 100 + (roomCounter * 2), x, BCH_ROOM_TOP_Y);      
      createRoom(floorNum * 100 + (roomCounter * 2) + 1, x, BCH_ROOM_BOTTOM_Y); 
      roomCounter++;
    }
  }

  // 4. ENTRANCE (Ground Floor)
  const entranceId = "BCH Entrance";
  const entHallX = Math.round(BCH_ENTRANCE_X / BCH_HALL_NODE_SPACING) * BCH_HALL_NODE_SPACING;
  const entHallId = `BCH_F0_Hall_${entHallX}`;
  
  nodes[entranceId] = {
    id: entranceId, 
    x: BCH_ENTRANCE_X, 
    y: BCH_ENTRANCE_Y, 
    floor: 0, 
    type: 'entrance', 
    neighbors: [entHallId] 
  };
  
  if (nodes[entHallId]) nodes[entHallId].neighbors.push(entranceId);

  return nodes;
};