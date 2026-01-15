/**
 * ═══════════════════════════════════════════════════════════════════
 * OUTDOOR CAMPUS CONFIGURATION (FIXED VERSION)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/constants/outdoorConfig.js
 * 
 * FIXES APPLIED:
 * ✅ Removed duplicate "Nursing_Entrance" outdoor node
 * ✅ Only one entrance path: outdoor roads → existing "Nursing Entrance" (indoor)
 * ✅ Simplified connection logic
 * 
 * CONNECTION FLOW:
 * Main Building "Back Exit" (indoor)
 *   ↓
 * "Main_Exit" (outdoor node)
 *   ↓
 * Road nodes (outdoor)
 *   ↓
 * "Nursing Entrance" (indoor node - already exists in nursingGraphGenerator)
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import { CAMPUS_WIDTH, CAMPUS_HEIGHT } from './buildingsConfig';

/**
 * OUTDOOR NODES - CAMPUS PATHWAYS
 * These nodes create the walking paths between buildings
 */
export const OUTDOOR_NODES = {
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ MAIN BUILDING EXIT CONNECTION                                    │
  // └─────────────────────────────────────────────────────────────────┘
  
  'Main_Exit': {
    id: 'Main_Exit',
    x: 600,           // Center of Main Building
    y: 510,           // Just outside the building (front)
    floor: 0,
    building: 'outdoor',
    type: 'exit',
    label: 'Main Exit',
    neighbors: ['Road_Central_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ CENTRAL CAMPUS ROAD NODES                                        │
  // │ These create the main pathway connecting buildings               │
  // └─────────────────────────────────────────────────────────────────┘
  
  'Road_Central_1': {
    id: 'Road_Central_1',
    x: 600,
    y: 420,           // On the horizontal path
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Main_Exit', 'Road_Central_2']
  },

  'Road_Central_2': {
    id: 'Road_Central_2',
    x: 600,
    y: 340,           // Moving up toward intersection
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Central_1', 'Road_Junction']
  },

  // Central junction where paths split
  'Road_Junction': {
    id: 'Road_Junction',
    x: 600,
    y: 260,           // Center of campus (intersection point)
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Junction',
    neighbors: ['Road_Central_2', 'Road_ToNursing_1', 'Road_ToBCH_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO NURSING BUILDING                                         │
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

  // ✅ FIXED: Final outdoor node before entering Nursing Building
  // This connects to the EXISTING "Nursing Entrance" node (indoor)
  // Connection is made in unifiedGraphGenerator.js
  'Road_ToNursing_3': {
    id: 'Road_ToNursing_3',
    x: 880,
    y: 260,           // Just outside Nursing Building
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToNursing_2']
    // NOTE: Connection to "Nursing Entrance" (indoor) added in unifiedGraphGenerator
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO BCH BUILDING (Coming Soon)                               │
  // └─────────────────────────────────────────────────────────────────┘
  
  'Road_ToBCH_1': {
    id: 'Road_ToBCH_1',
    x: 520,
    y: 200,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Junction', 'Road_ToBCH_2']
  },

  'Road_ToBCH_2': {
    id: 'Road_ToBCH_2',
    x: 450,
    y: 140,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToBCH_1']
    // 🚧 BCH connection coming soon
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * VISUAL ROAD SEGMENTS FOR OUTSIDEVIEW
 * ═══════════════════════════════════════════════════════════════════
 * 
 * These define the visual roads/paths drawn on the campus map.
 * Each segment connects two points.
 */
export const ROAD_SEGMENTS = [
  // Main Building to Junction
  { x1: 600, y1: 510, x2: 600, y2: 260 },
  
  // Junction to Nursing Building
  { x1: 600, y1: 260, x2: 880, y2: 260 },
  
  // Junction to BCH Building (partial - coming soon)
  { x1: 600, y1: 260, x2: 450, y2: 140 }
];

/**
 * ═══════════════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Get all outdoor nodes as an array
 */
export const getOutdoorNodes = () => Object.values(OUTDOOR_NODES);

/**
 * Check if a node ID is an outdoor node
 */
export const isOutdoorNode = (nodeId) => {
  return OUTDOOR_NODES.hasOwnProperty(nodeId);
};