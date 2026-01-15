/**
 * ═══════════════════════════════════════════════════════════════════
 * UNIFIED CAMPUS GRAPH GENERATOR (FIXED)
 * ═══════════════════════════════════════════════════════════════════
 * * FILE LOCATION: src/utils/unifiedGraphGenerator.js
 * * UPDATES:
 * ✅ Added BCH Building Graph generation
 * ✅ Connected BCH Entrance to Outdoor Path
 * * ═══════════════════════════════════════════════════════════════════
 */

import { generateBuildingGraph } from './graphGenerator';
import { generateNursingBuildingGraph } from './nursingGraphGenerator';
import { generateBCHBuildingGraph } from './bchGraphGenerator'; // ✅ ADDED IMPORT
import { OUTDOOR_NODES } from '../constants/outdoorConfig';

export const generateUnifiedGraph = () => {
  console.log('🏗️ Building unified campus graph...');
  
  // 1. Generate individual building graphs
  const mainGraph = generateBuildingGraph();
  const nursingGraph = generateNursingBuildingGraph();
  const bchGraph = generateBCHBuildingGraph(); // ✅ GENERATE BCH GRAPH
  
  console.log('  📊 Main Building:', Object.keys(mainGraph).length, 'nodes');
  console.log('  📊 Nursing Building:', Object.keys(nursingGraph).length, 'nodes');
  console.log('  📊 BCH Building:', Object.keys(bchGraph).length, 'nodes');
  console.log('  📊 Outdoor:', Object.keys(OUTDOOR_NODES).length, 'nodes');
  
  // 2. Create unified graph by combining all
  const unifiedGraph = {
    ...mainGraph,
    ...nursingGraph,
    ...bchGraph, // ✅ MERGE BCH GRAPH
    ...OUTDOOR_NODES
  };

  console.log('  ✅ Total unified graph:', Object.keys(unifiedGraph).length, 'nodes');

  // 3. Connect buildings to outdoor nodes
  connectBuildingToOutdoor(unifiedGraph);
  
  return unifiedGraph;
};

const connectBuildingToOutdoor = (graph) => {
  console.log('🔗 Connecting buildings to outdoor paths...');
  
  // --- MAIN BUILDING CONNECTION ---
  const mainBackExit = 'Back Exit';
  const mainOutdoorExit = 'Main_Exit';
  
  if (graph[mainBackExit] && graph[mainOutdoorExit]) {
    graph[mainBackExit].neighbors.push(mainOutdoorExit);
    graph[mainOutdoorExit].neighbors.push(mainBackExit);
  }

  // --- NURSING BUILDING CONNECTION ---
  const nursingIndoorEntrance = 'Nursing Entrance';
  const nursingOutdoorRoad = 'Road_ToNursing_3';
  
  if (graph[nursingIndoorEntrance] && graph[nursingOutdoorRoad]) {
    graph[nursingIndoorEntrance].neighbors.push(nursingOutdoorRoad);
    graph[nursingOutdoorRoad].neighbors.push(nursingIndoorEntrance);
  }

  // --- BCH BUILDING CONNECTION (✅ NEW) ---
  const bchIndoorEntrance = 'BCH Entrance';
  const bchOutdoorRoad = 'Road_ToBCH_2'; // Connecting to the road defined in outdoorConfig
  
  if (graph[bchIndoorEntrance] && graph[bchOutdoorRoad]) {
    // Add two-way connection
    if (!graph[bchIndoorEntrance].neighbors.includes(bchOutdoorRoad)) {
      graph[bchIndoorEntrance].neighbors.push(bchOutdoorRoad);
    }
    if (!graph[bchOutdoorRoad].neighbors.includes(bchIndoorEntrance)) {
      graph[bchOutdoorRoad].neighbors.push(bchIndoorEntrance);
    }
    console.log('  ✅ Connected: BCH Building ↔ Outdoor Path');
  } else {
    console.warn('  ⚠️ Could not connect BCH to outdoor (Check node IDs)');
  }
};

export const getRoomsByBuilding = (graph) => {
  const buildings = {
    main: [],
    nursing: [],
    bch: [], // ✅ Ensure BCH array exists
    outdoor: []
  };

  Object.values(graph).forEach(node => {
    const selectableTypes = ['room', 'kiosk', 'exit', 'library', 'entrance'];
    
    if (selectableTypes.includes(node.type)) {
      // Determine building bucket
      let building = node.building || 'main'; 
      
      // Fallback inference if building property is missing
      if (!node.building) {
        if (node.id.includes('Nursing') || node.id.includes('NF')) building = 'nursing';
        else if (node.id.includes('BCH')) building = 'bch';
        else if (node.id.includes('Road') || node.id.includes('Main_Exit')) building = 'outdoor';
      }

      if (buildings[building]) {
        buildings[building].push(node);
      }
    }
  });

  // Sort rooms
  Object.keys(buildings).forEach(key => {
    buildings[key].sort((a, b) => {
      const aLabel = a.label || a.id;
      const bLabel = b.label || b.id;
      return aLabel.localeCompare(bLabel);
    });
  });

  return buildings;
};

export const getNodeBuilding = (node) => {
  if (!node) return 'unknown';
  if (node.building) return node.building;
  if (node.id.includes('Nursing') || node.id.includes('NF')) return 'nursing';
  if (node.id.includes('BCH')) return 'bch'; // ✅ Added BCH inference
  if (node.id.includes('Road') || node.id.includes('Main_Exit')) return 'outdoor';
  return 'main';
};