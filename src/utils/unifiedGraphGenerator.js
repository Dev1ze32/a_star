/**
 * ═══════════════════════════════════════════════════════════════════
 * UNIFIED CAMPUS GRAPH GENERATOR (FIXED VERSION)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/utils/unifiedGraphGenerator.js
 * 
 * FIXES APPLIED:
 * ✅ Fixed connection logic for Nursing Entrance
 * ✅ Removed duplicate entrance node handling
 * ✅ Clear connection path: Main → Outdoor → Nursing
 * ✅ Better error logging for debugging
 * 
 * CONNECTION STRUCTURE:
 * 
 * Main Building:
 *   Kiosk → ... → Back Exit (indoor)
 *        ↓
 * Outdoor:
 *   Main_Exit → Roads → Road_ToNursing_3
 *        ↓
 * Nursing Building:
 *   Nursing Entrance (indoor) → ... → Nursing Library/Rooms
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import { generateBuildingGraph } from './graphGenerator';
import { generateNursingBuildingGraph } from './nursingGraphGenerator';
import { OUTDOOR_NODES } from '../constants/outdoorConfig';

/**
 * Generate unified campus graph with all buildings + outdoor connections
 * @returns {Object} Complete graph with all nodes from all buildings + outdoor
 */
export const generateUnifiedGraph = () => {
  console.log('🏗️ Building unified campus graph...');
  
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ STEP 1: Generate individual building graphs                      │
  // └─────────────────────────────────────────────────────────────────┘
  
  const mainGraph = generateBuildingGraph();        // Main Building nodes
  const nursingGraph = generateNursingBuildingGraph(); // Nursing Building nodes
  
  console.log('  📊 Main Building:', Object.keys(mainGraph).length, 'nodes');
  console.log('  📊 Nursing Building:', Object.keys(nursingGraph).length, 'nodes');
  console.log('  📊 Outdoor:', Object.keys(OUTDOOR_NODES).length, 'nodes');
  
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ STEP 2: Create unified graph by combining all graphs             │
  // └─────────────────────────────────────────────────────────────────┘
  
  const unifiedGraph = {
    ...mainGraph,
    ...nursingGraph,
    ...OUTDOOR_NODES   // Add outdoor pathway nodes
  };

  console.log('  ✅ Total unified graph:', Object.keys(unifiedGraph).length, 'nodes');

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ STEP 3: Connect buildings to outdoor nodes                       │
  // └─────────────────────────────────────────────────────────────────┘

  connectBuildingToOutdoor(unifiedGraph);
  
  console.log('✅ Unified campus graph complete!');

  return unifiedGraph;
};

/**
 * Connect indoor building nodes to outdoor pathway nodes
 * This creates the bridges between building interiors and campus paths
 */
const connectBuildingToOutdoor = (graph) => {
  console.log('🔗 Connecting buildings to outdoor paths...');
  
  // ═════════════════════════════════════════════════════════════════
  // MAIN BUILDING → OUTDOOR CONNECTION
  // ═════════════════════════════════════════════════════════════════
  
  const mainBackExit = 'Back Exit';           // Indoor node (Main Building)
  const mainOutdoorExit = 'Main_Exit';        // Outdoor node
  
  if (graph[mainBackExit] && graph[mainOutdoorExit]) {
    // Add two-way connection
    if (!graph[mainBackExit].neighbors.includes(mainOutdoorExit)) {
      graph[mainBackExit].neighbors.push(mainOutdoorExit);
    }
    if (!graph[mainOutdoorExit].neighbors.includes(mainBackExit)) {
      graph[mainOutdoorExit].neighbors.push(mainBackExit);
    }
    
    console.log('  ✅ Connected: Main Building "Back Exit" ↔ Outdoor "Main_Exit"');
  } else {
    console.error('  ❌ FAILED to connect Main Building:');
    console.error('     Back Exit exists?', !!graph[mainBackExit]);
    console.error('     Main_Exit exists?', !!graph[mainOutdoorExit]);
  }

  // ═════════════════════════════════════════════════════════════════
  // NURSING BUILDING → OUTDOOR CONNECTION
  // ═════════════════════════════════════════════════════════════════
  
  const nursingIndoorEntrance = 'Nursing Entrance';  // Indoor node (Nursing Building)
  const nursingOutdoorRoad = 'Road_ToNursing_3';     // Last outdoor node before building
  
  if (graph[nursingIndoorEntrance] && graph[nursingOutdoorRoad]) {
    // Add two-way connection
    if (!graph[nursingIndoorEntrance].neighbors.includes(nursingOutdoorRoad)) {
      graph[nursingIndoorEntrance].neighbors.push(nursingOutdoorRoad);
    }
    if (!graph[nursingOutdoorRoad].neighbors.includes(nursingIndoorEntrance)) {
      graph[nursingOutdoorRoad].neighbors.push(nursingIndoorEntrance);
    }
    
    console.log('  ✅ Connected: Outdoor "Road_ToNursing_3" ↔ Nursing Building "Nursing Entrance"');
  } else {
    console.error('  ❌ FAILED to connect Nursing Building:');
    console.error('     Nursing Entrance exists?', !!graph[nursingIndoorEntrance]);
    console.error('     Road_ToNursing_3 exists?', !!graph[nursingOutdoorRoad]);
    
    // Debug: List all nodes that contain "Nursing"
    const nursingNodes = Object.keys(graph).filter(key => key.includes('Nursing'));
    console.log('     Available Nursing nodes:', nursingNodes.slice(0, 5), '...');
  }

  // ═════════════════════════════════════════════════════════════════
  // BCH BUILDING → OUTDOOR CONNECTION (Coming Soon)
  // ═════════════════════════════════════════════════════════════════
  
  // TODO: When BCH outdoor pathfinding is ready, add:
  // const bchIndoorEntrance = 'BCH Entrance';
  // const bchOutdoorRoad = 'Road_ToBCH_2';
  // ... connect them similarly
  
  console.log('  🚧 BCH Building outdoor connection: Coming soon');
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * HELPER FUNCTIONS FOR GRAPH FILTERING
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * Get all rooms/locations grouped by building for dropdown menus
 * @param {Object} graph - The unified graph
 * @returns {Object} { main: [], nursing: [], outdoor: [] }
 */
export const getRoomsByBuilding = (graph) => {
  const buildings = {
    main: [],
    nursing: [],
    outdoor: []
  };

  Object.values(graph).forEach(node => {
    // Only include user-selectable locations (not hallways, stairs, roads)
    const selectableTypes = ['room', 'kiosk', 'exit', 'library', 'entrance'];
    
    if (selectableTypes.includes(node.type)) {
      const building = node.building || 'main'; // Default to main if not specified
      
      if (buildings[building]) {
        buildings[building].push(node);
      }
    }
  });

  // Sort rooms within each building
  Object.keys(buildings).forEach(key => {
    buildings[key].sort((a, b) => {
      // Sort by label if available, otherwise by ID
      const aLabel = a.label || a.id;
      const bLabel = b.label || b.id;
      return aLabel.localeCompare(bLabel);
    });
  });

  console.log('📋 Rooms by building:');
  console.log('   Main:', buildings.main.length);
  console.log('   Nursing:', buildings.nursing.length);
  console.log('   Outdoor:', buildings.outdoor.length);

  return buildings;
};

/**
 * Determine which building a node belongs to
 * @param {Object} node - Graph node
 * @returns {string} Building ID ('main', 'nursing', 'bch', 'outdoor')
 */
export const getNodeBuilding = (node) => {
  if (!node) return 'unknown';
  
  // Check if node has explicit building property
  if (node.building) return node.building;
  
  // Otherwise infer from node ID
  if (node.id.includes('Nursing') || node.id.includes('NF')) return 'nursing';
  if (node.id.includes('BCH')) return 'bch';
  if (node.id.includes('Road') || node.id.includes('Main_Exit')) return 'outdoor';
  
  return 'main'; // Default
};