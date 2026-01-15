/**
 * ═══════════════════════════════════════════════════════════════════
 * UNIFIED CAMPUS NAVIGATION HOOK
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/hooks/useUnifiedNavigation.js
 * 
 * This hook manages navigation across the ENTIRE CAMPUS:
 * - All buildings (Main, Nursing, BCH)
 * - Outdoor pathways
 * - Building-to-building navigation
 * 
 * FEATURES:
 * - Single graph for entire campus
 * - Pathfinding works across buildings
 * - Automatically handles indoor → outdoor → indoor transitions
 * - Groups rooms by building for dropdown menus
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { generateUnifiedGraph, getRoomsByBuilding, getNodeBuilding } from '../utils/unifiedGraphGenerator';
import { findPath } from '../utils/pathfinding';

export const useUnifiedNavigation = () => {
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ STATE MANAGEMENT                                                 │
  // └─────────────────────────────────────────────────────────────────┘
  
  const [startNode, setStartNode] = useState('Kiosk');  // Default: Main Building Kiosk
  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState([]);                  // Array of node IDs in path
  const [activeFloor, setActiveFloor] = useState(0);     // Current floor being viewed
  const [activeBuilding, setActiveBuilding] = useState('main'); // Current building view
  
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ GRAPH GENERATION (Memoized for performance)                      │
  // └─────────────────────────────────────────────────────────────────┘
  
  // Generate unified campus graph once
  const graph = useMemo(() => {
    const unifiedGraph = generateUnifiedGraph();
    console.log('🗺️ Unified campus graph generated:', Object.keys(unifiedGraph).length, 'nodes');
    return unifiedGraph;
  }, []);
  
  // Group rooms by building for organized dropdown menus
  const roomsByBuilding = useMemo(() => {
    return getRoomsByBuilding(graph);
  }, [graph]);

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATHFINDING FUNCTIONS                                            │
  // └─────────────────────────────────────────────────────────────────┘
  
  /**
   * Calculate path between start and end nodes
   * Works across buildings automatically!
   */
  const calculatePath = () => {
    if (!startNode || !endNode) {
      console.warn('⚠️ Cannot calculate path: Missing start or end node');
      return;
    }

    if (!graph[startNode]) {
      console.error('❌ Start node not found:', startNode);
      return;
    }

    if (!graph[endNode]) {
      console.error('❌ End node not found:', endNode);
      return;
    }

    // Run A* pathfinding algorithm
    const calculatedPath = findPath(graph, startNode, endNode);
    
    if (calculatedPath.length === 0) {
      console.warn('⚠️ No path found between', startNode, 'and', endNode);
      alert('No path found! These locations may not be connected yet.');
      return;
    }

    setPath(calculatedPath);
    console.log('✅ Path calculated:', calculatedPath.length, 'steps');
    console.log('📍 Path:', calculatedPath.join(' → '));

    // Set initial view to starting location
    if (graph[startNode]) {
      setActiveFloor(graph[startNode].floor || 0);
      setActiveBuilding(getNodeBuilding(graph[startNode]));
    }
  };

  /**
   * Clear current path
   */
  const clearPath = () => {
    setPath([]);
  };

  /**
   * Get outdoor portion of path (for OutsideView visualization)
   */
  const getOutdoorPath = () => {
    return path.filter(nodeId => {
      const node = graph[nodeId];
      return node && (node.building === 'outdoor' || node.type === 'exit' || node.type === 'entrance');
    });
  };

  /**
   * Check if path crosses multiple buildings
   */
  const isCrossBuildingPath = () => {
    if (path.length === 0) return false;
    
    const buildings = new Set();
    path.forEach(nodeId => {
      const node = graph[nodeId];
      if (node) {
        buildings.add(getNodeBuilding(node));
      }
    });
    
    // Remove 'outdoor' from count (it's not a building)
    buildings.delete('outdoor');
    
    return buildings.size > 1;
  };

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ NAVIGATION HELPERS                                               │
  // └─────────────────────────────────────────────────────────────────┘

  /**
   * Jump to a specific node's location (floor + building)
   */
  const jumpToNode = (nodeId) => {
    const node = graph[nodeId];
    if (node) {
      setActiveFloor(node.floor || 0);
      setActiveBuilding(getNodeBuilding(node));
    }
  };

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ RETURN ALL STATE AND FUNCTIONS                                   │
  // └─────────────────────────────────────────────────────────────────┘

  return {
    // Graph data
    graph,
    roomsByBuilding,
    
    // Navigation state
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    path,
    activeFloor,
    setActiveFloor,
    activeBuilding,
    setActiveBuilding,
    
    // Functions
    calculatePath,
    clearPath,
    getOutdoorPath,
    isCrossBuildingPath,
    jumpToNode
  };
};