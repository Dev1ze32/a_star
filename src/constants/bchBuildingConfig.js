/**
 * ═══════════════════════════════════════════════════════════════════
 * BCH BUILDING CONFIGURATION - YOUR CONTROL PANEL
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 🎯 QUICK GUIDE TO ADJUSTING THE BUILDING:
 * 
 * Want to move rooms? → Change BCH_ROOM_START_X / BCH_ROOM_END_X
 * Want more rooms? → Change BCH_ROOMS_PER_SIDE
 * Want to move stairs? → Change BCH_STAIR_X
 * Want to move elevator? → Change BCH_ELEVATOR_X
 * Want taller/wider building? → Change BCH_BUILDING_WIDTH/HEIGHT
 * Want to move hallways? → Change BCH_HALL_TOP_Y / BCH_HALL_BOTTOM_Y
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 
 * BUILDING LAYOUT DIAGRAM:
 * 
 *     TOP ROW (Even numbers: 100, 102, 104...)
 *   [100] [102] [104] [106] [108] [110] [112] [114]
 *      │     │     │     │     │     │     │     │
 *   ───┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴───  ← Top Hallway
 *                    │ STAIR │ ELEV │
 *   ───┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬───  ← Bottom Hallway
 *      │     │     │     │     │     │     │     │
 *   [101] [103] [105] [107] [109] [111] [113] [115]
 *     BOTTOM ROW (Odd numbers: 101, 103, 105...)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 1️⃣ BASIC BUILDING DIMENSIONS                                    │
// └─────────────────────────────────────────────────────────────────┘

// Total floors (Ground=0, then 1,2,3,4)
// Building canvas width
// Building canvas height
export const BCH_FLOORS = 5;
export const BCH_BUILDING_WIDTH = 1200;
export const BCH_BUILDING_HEIGHT = 500;

/**
 * 💡 TIP: Change these to resize the entire building!
 * - Wider building? Increase WIDTH (e.g., 1200 → 1400)
 * - Taller building? Increase HEIGHT (e.g., 500 → 600)
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 2️⃣ HALLWAY POSITIONS                                            │
// │    Where people walk horizontally                               │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_HALL_Y = 250;            // Center of the building
export const BCH_HALL_HEIGHT = 60;        // Width of the corridor

/**
 * 💡 HALLWAY ADJUSTMENT TIPS:
 * 
 * To move hallways UP/DOWN:
 * - Decrease Y value → Moves UP
 * - Increase Y value → Moves DOWN
 * 
 * Example Adjustments:
 * BCH_HALL_TOP_Y = 180 → 150 (moves top hallway UP by 30px)
 * BCH_HALL_BOTTOM_Y = 320 → 350 (moves bottom hallway DOWN by 30px)
 * 
 * ⚠️ IMPORTANT: Keep 140px gap between hallways for room spacing!
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 3️⃣ ROOM CONFIGURATION                                           │
// │    Controls room count and horizontal spacing                   │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_ROOMS_PER_SIDE = 8;
export const BCH_ROOM_START_X = 80;
export const BCH_ROOM_END_X = 500;        // End of Left Wing (Room 114)
export const BCH_ROOM_START_X_RIGHT = 700; // Start of Right Wing (Room 116)
export const BCH_ROOM_END_X_RIGHT = 1120;

export const BCH_ROOM_SPACING_LEFT = (BCH_ROOM_END_X - BCH_ROOM_START_X) / (BCH_ROOMS_PER_SIDE - 1);
export const BCH_ROOM_SPACING_RIGHT = (BCH_ROOM_END_X_RIGHT - BCH_ROOM_START_X_RIGHT) / (BCH_ROOMS_PER_SIDE - 1);

// Rooms placed relative to the central hallway
export const BCH_ROOM_TOP_Y = BCH_HALL_Y - 100;    // Rooms above hallway
export const BCH_ROOM_BOTTOM_Y = BCH_HALL_Y + 100; // Rooms below hallway

/**
 * 💡 ROOM ADJUSTMENT GUIDE:
 * 
 * 1️⃣ TO ADD/REMOVE ROOMS:
 *    Change BCH_ROOMS_PER_SIDE
 *    - 8 → 10 means 10 rooms per side (20 total)
 *    - 8 → 6 means 6 rooms per side (12 total)
 *    - Spacing automatically adjusts!
 * 
 * 2️⃣ TO MOVE ALL LEFT ROOMS:
 *    Change BCH_ROOM_START_X and BCH_ROOM_END_X
 *    - Move left: 80→60, 500→480
 *    - Move right: 80→100, 500→520
 * 
 * 3️⃣ TO MOVE ALL RIGHT ROOMS:
 *    Change BCH_ROOM_START_X_RIGHT and BCH_ROOM_END_X_RIGHT
 *    - Move left: 700→680, 1120→1100
 *    - Move right: 700→720, 1120→1140
 * 
 * 4️⃣ TO MAKE ROOMS CLOSER/FARTHER APART:
 *    Change END_X values only
 *    - Closer: BCH_ROOM_END_X = 500→400
 *    - Farther: BCH_ROOM_END_X = 500→550
 * 
 * 5️⃣ TO MOVE ROOMS CLOSER/FARTHER FROM HALLWAY:
 *    Change offset values (70) in:
 *    - BCH_ROOM_TOP_Y = BCH_HALL_TOP_Y - 70 (change 70)
 *    - BCH_ROOM_BOTTOM_Y = BCH_HALL_BOTTOM_Y + 70 (change 70)
 * 
 * 📐 ROOM NUMBERING LOGIC:
 * - Ground Floor (0): 100-115
 * - Floor 1: 200-215
 * - Floor 2: 300-315
 * - Top row (even): 100, 102, 104... (left), 108, 110, 112... (right)
 * - Bottom row (odd): 101, 103, 105... (left), 109, 111, 113... (right)
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 4️⃣ STAIRS CONFIGURATION                                         │
// │    Main vertical connection between floors                      │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_STAIR_X = 560;           
export const BCH_STAIR_WIDTH = 60;
export const BCH_STAIR_Y = BCH_ROOM_TOP_Y;    // On the hallway line

/**
 * 💡 STAIRS ADJUSTMENT TIPS:
 * 
 * 1️⃣ TO MOVE STAIRS LEFT/RIGHT:
 *    Change BCH_STAIR_X
 *    - Move left: 580 → 550
 *    - Move right: 580 → 610
 * 
 * 2️⃣ TO MAKE STAIRS WIDER/NARROWER:
 *    Change BCH_STAIR_WIDTH
 *    - Wider: 70 → 90
 *    - Narrower: 70 → 50
 * 
 * ℹ️ NOTE: Stairs automatically connect to both hallways!
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 5️⃣ ELEVATOR CONFIGURATION                                       │
// │    Alternative vertical connection (faster in real life!)       │
// └─────────────────────────────────────────────────────────────────┘
export const BCH_ELEVATOR_X = 640;        
export const BCH_ELEVATOR_WIDTH = 60;
export const BCH_ELEVATOR_Y = BCH_ROOM_TOP_Y; // On the hallway line

/**
 * 💡 ELEVATOR ADJUSTMENT TIPS:
 * 
 * 1️⃣ TO MOVE ELEVATOR LEFT/RIGHT:
 *    Change BCH_ELEVATOR_X
 *    - Move left (closer to stairs): 680 → 650
 *    - Move right (farther from stairs): 680 → 710
 * 
 * 2️⃣ TO MAKE ELEVATOR WIDER/NARROWER:
 *    Change BCH_ELEVATOR_WIDTH
 * 
 * 3️⃣ TO SWAP STAIR AND ELEVATOR POSITIONS:
 *    Swap their X values:
 *    BCH_STAIR_X = 680
 *    BCH_ELEVATOR_X = 580
 * 
 * ℹ️ NOTE: In pathfinding, elevator = stairs (same algorithm)
 * Future enhancement: Add elevator preference for accessibility!
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 6️⃣ SPECIAL NODES CONFIGURATION                                  │
// │    Entrance, exits, and other points of interest                │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_ENTRANCE_X = 600;        // Dead center
export const BCH_ENTRANCE_Y = 400;        // Below bottom rooms

/**
 * 💡 ENTRANCE ADJUSTMENT TIPS:
 * 
 * To move entrance:
 * - Left/Right: Change BCH_ENTRANCE_X
 * - Up/Down: Change offset in BCH_ENTRANCE_Y (currently +100)
 * 
 * Example: Move entrance up
 * BCH_ENTRANCE_Y = BCH_HALL_BOTTOM_Y + 100 → + 80
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │ 7️⃣ HALLWAY NODE GENERATION                                      │
// │    Controls how many "walking points" exist in hallways         │
// └─────────────────────────────────────────────────────────────────┘

export const BCH_HALL_NODE_SPACING = 50  // Distance between hallway nodes

/**
 * 💡 HALLWAY NODES:
 * 
 * These are invisible "waypoints" for pathfinding.
 * - Smaller spacing = More precise paths (but more nodes)
 * - Larger spacing = Faster calculations (but less precise)
 * 
 * Default: 100px spacing (good balance)
 * For smoother paths: 80px
 * For faster performance: 120px
 */

// ═══════════════════════════════════════════════════════════════════
// 🎓 QUICK REFERENCE SUMMARY
// ═══════════════════════════════════════════════════════════════════
/**
 * MOST COMMON ADJUSTMENTS:
 * 
 * 1. Move stairs: BCH_STAIR_X = 580 → (new value)
 * 2. Move elevator: BCH_ELEVATOR_X = 680 → (new value)
 * 3. Add more rooms: BCH_ROOMS_PER_SIDE = 8 → 10
 * 4. Spread rooms out: BCH_ROOM_END_X = 500 → 550
 * 5. Move hallways: BCH_HALL_TOP_Y and BCH_HALL_BOTTOM_Y
 * 
 * ⚠️ AFTER CHANGES:
 * 1. Save this file
 * 2. Refresh browser (auto-reloads)
 * 3. Turn on Design Mode to verify positions
 */