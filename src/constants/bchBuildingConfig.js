/**
 * ═══════════════════════════════════════════════════════════════════
 * BCH BUILDING CONFIGURATION - YOUR CONTROL PANEL
 * ═══════════════════════════════════════════════════════════════════
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 1️⃣ BASIC BUILDING DIMENSIONS                                    │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_FLOORS = 5;
export const BCH_BUILDING_WIDTH = 1200;
export const BCH_BUILDING_HEIGHT = 500;

// ┌─────────────────────────────────────────────────────────────────┐
// │ 2️⃣ HALLWAY POSITIONS                                            │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_HALL_Y = 250;            
export const BCH_HALL_HEIGHT = 60;        

// ┌─────────────────────────────────────────────────────────────────┐
// │ 3️⃣ ROOM CONFIGURATION (✅ UPDATED)                              │
// └─────────────────────────────────────────────────────────────────┘

// ✅ SET TO 4: This creates 4 columns per wing.
// 4 columns * 2 rows (Top/Bottom) = 8 rooms per wing.
// 8 Left + 8 Right = 16 Rooms Total per Floor.
export const BCH_ROOMS_PER_SIDE = 4; 

export const BCH_ROOM_START_X = 80;
export const BCH_ROOM_END_X = 500;        // End of Left Wing
export const BCH_ROOM_START_X_RIGHT = 700; // Start of Right Wing
export const BCH_ROOM_END_X_RIGHT = 1120;

// Auto-calculate spacing to fill the available width evenly
export const BCH_ROOM_SPACING_LEFT = (BCH_ROOM_END_X - BCH_ROOM_START_X) / (BCH_ROOMS_PER_SIDE - 1);
export const BCH_ROOM_SPACING_RIGHT = (BCH_ROOM_END_X_RIGHT - BCH_ROOM_START_X_RIGHT) / (BCH_ROOMS_PER_SIDE - 1);

export const BCH_ROOM_TOP_Y = BCH_HALL_Y - 100;    
export const BCH_ROOM_BOTTOM_Y = BCH_HALL_Y + 100; 

// ┌─────────────────────────────────────────────────────────────────┐
// │ 4️⃣ STAIRS CONFIGURATION (RETAINED)                              │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_STAIR_X = 560;           
export const BCH_STAIR_WIDTH = 60;
export const BCH_STAIR_Y = BCH_ROOM_TOP_Y;    

// ┌─────────────────────────────────────────────────────────────────┐
// │ 5️⃣ ELEVATOR CONFIGURATION (RETAINED)                            │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_ELEVATOR_X = 640;        
export const BCH_ELEVATOR_WIDTH = 60;
export const BCH_ELEVATOR_Y = BCH_ROOM_TOP_Y; 

// ┌─────────────────────────────────────────────────────────────────┐
// │ 6️⃣ SPECIAL NODES CONFIGURATION                                  │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_ENTRANCE_X = 600;        
export const BCH_ENTRANCE_Y = 400;        

// ┌─────────────────────────────────────────────────────────────────┐
// │ 7️⃣ HALLWAY NODE GENERATION                                      │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_HALL_NODE_SPACING = 50;