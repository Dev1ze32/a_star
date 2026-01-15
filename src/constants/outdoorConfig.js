/**
 * ═══════════════════════════════════════════════════════════════════
 * OUTDOOR CAMPUS CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 * * FILE LOCATION: src/constants/outdoorConfig.js
 * * 🎯 HOW TO MODIFY ROADS AND NODES:
 * * 1. UNDERSTAND THE COORDINATE SYSTEM:
 * - X: 0 is Left, 1200 is Right
 * - Y: 0 is Top, 800 is Bottom
 * - Use "Design Mode" in the app (Pen icon) to see X/Y of your mouse!
 * * 2. TO MOVE A ROAD PATH:
 * - Update the 'x' and 'y' values in OUTDOOR_NODES below.
 * - Update the matching coordinates in ROAD_SEGMENTS at the bottom.
 * * 3. TO ADD A NEW BUILDING CONNECTION:
 * - Create a new node in OUTDOOR_NODES (e.g., 'Road_ToNewBuilding')
 * - Set its 'x' and 'y' to be just outside the new building's door.
 * - Add it to the 'neighbors' list of the nearest road node.
 * - Add a visual line in ROAD_SEGMENTS.
 * * ═══════════════════════════════════════════════════════════════════
 */

import { CAMPUS_WIDTH, CAMPUS_HEIGHT } from './buildingsConfig';

export const OUTDOOR_NODES = {
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ MAIN BUILDING EXIT                                               │
  // │ Connects the indoor "Back Exit" to the outdoors                  │
  // └─────────────────────────────────────────────────────────────────┘
  'Main_Exit': {
    id: 'Main_Exit',
    x: 600,           
    y: 510,           
    floor: 0,
    building: 'outdoor',
    type: 'exit',
    label: 'Main Exit',
    neighbors: ['Road_Central_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ CENTRAL ROAD (The Spine)                                         │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_Central_1': {
    id: 'Road_Central_1',
    x: 600,
    y: 420,           
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Main_Exit', 'Road_Central_2']
  },

  'Road_Central_2': {
    id: 'Road_Central_2',
    x: 600,
    y: 340,           
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Central_1', 'Road_Junction']
  },

  'Road_Junction': {
    id: 'Road_Junction',
    x: 600,
    y: 260,           // The central intersection
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Junction',
    neighbors: ['Road_Central_2', 'Road_ToNursing_1', 'Road_ToBCH_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO NURSING BUILDING (Right Side)                            │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_ToNursing_1': {
    id: 'Road_ToNursing_1',
    x: 700,
    y: 260,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Junction', 'Road_ToNursing_2']
  },

  'Road_ToNursing_2': {
    id: 'Road_ToNursing_2',
    x: 800,
    y: 260,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToNursing_1', 'Road_ToNursing_3']
  },

  // ✅ UPDATED: Moved Y down to 360 to connect to bottom of Nursing building
  'Road_ToNursing_3': {
    id: 'Road_ToNursing_3',
    x: 880,
    y: 360,           
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToNursing_2']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO BCH BUILDING (Left/Top Side)                             │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_ToBCH_1': {
    id: 'Road_ToBCH_1',
    x: 520,
    y: 240, // Smoothed curve
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Junction', 'Road_ToBCH_2']
  },

  // ✅ UPDATED: Moved to (430, 220) to hit the BCH Front Door exactly
  'Road_ToBCH_2': {
    id: 'Road_ToBCH_2',
    x: 430,
    y: 220,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToBCH_1']
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * VISUAL ROAD SEGMENTS
 * ⚠️ IMPORTANT: These lines draw the gray roads on the map.
 * If you change the NODE coordinates above, you MUST update these too!
 * ═══════════════════════════════════════════════════════════════════
 */
export const ROAD_SEGMENTS = [
  // Vertical Main Road
  { x1: 600, y1: 510, x2: 600, y2: 260 },
  
  // Horizontal to Nursing
  { x1: 600, y1: 260, x2: 880, y2: 260 }, // Horizontal part
  { x1: 880, y1: 260, x2: 880, y2: 360 }, // Vertical drop to Nursing Door (New)
  
  // Diagonal to BCH
  { x1: 600, y1: 260, x2: 430, y2: 220 }  // Direct line to BCH Door
];

export const getOutdoorNodes = () => Object.values(OUTDOOR_NODES);
export const isOutdoorNode = (nodeId) => OUTDOOR_NODES.hasOwnProperty(nodeId);