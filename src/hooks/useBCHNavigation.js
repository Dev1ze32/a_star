import { useState, useMemo } from 'react';
import { generateBCHBuildingGraph } from '../utils/bchGraphGenerator';
import { findPath } from '../utils/pathfinding';

/**
 * ═══════════════════════════════════════════════════════════════════
 * BCH NAVIGATION HOOK
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This hook manages all navigation state for the BCH building.
 * It handles:
 * - Graph generation (building structure)
 * - Room/location selection
 * - Pathfinding calculations
 * - Floor switching
 * 
 * You usually DON'T need to edit this file.
 * ═══════════════════════════════════════════════════════════════════
 */

export const useBCHNavigation = () => {
  // State: Where you start navigation from
  const [startNode, setStartNode] = useState('BCH Entrance');
  
  // State: Where you want to go
  const [endNode, setEndNode] = useState('');
  
  // State: The calculated path (array of node IDs)
  const [path, setPath] = useState([]);
  
  // State: Which floor is currently being displayed (0-4)
  const [activeFloor, setActiveFloor] = useState(0);

  // Generate the building graph once (memoized for performance)
  const graph = useMemo(() => generateBCHBuildingGraph(), []);
  
  // Get all rooms/locations for dropdown menus (memoized)
  const rooms = useMemo(() => {
    return Object.values(graph)
      .filter(n => ['room', 'entrance', 'elevator'].includes(n.type))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [graph]);

  // Calculate path between start and end nodes
  const calculatePath = () => {
    if (startNode && endNode) {
      const calculatedPath = findPath(graph, startNode, endNode);
      setPath(calculatedPath);
      
      // Switch to the starting floor
      if (graph[startNode]) {
        setActiveFloor(graph[startNode].floor);
      }
    }
  };

  // Return all state and functions for use in components
  return {
    graph,
    rooms,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    path,
    activeFloor,
    setActiveFloor,
    calculatePath
  };
};