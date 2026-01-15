import { useState, useMemo } from 'react';
import { generateUnifiedGraph, getRoomsByBuilding, getNodeBuilding } from '../utils/unifiedGraphGenerator';
import { findPath } from '../utils/pathfinding';

export const useUnifiedNavigation = () => {
  // ✅ FIXED: Start Node is ALWAYS 'Kiosk' (Main Building)
  const startNode = 'Kiosk'; 
  const setStartNode = () => {}; // Empty function to prevent crashes if components try to set it

  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState([]);
  const [activeFloor, setActiveFloor] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState('main');
  
  const graph = useMemo(() => generateUnifiedGraph(), []);
  const roomsByBuilding = useMemo(() => getRoomsByBuilding(graph), [graph]);

  const calculatePath = () => {
    if (!endNode) return; // Only check endNode since start is fixed

    if (!graph[startNode] || !graph[endNode]) {
      console.error('❌ Start or End node not found');
      return;
    }

    const calculatedPath = findPath(graph, startNode, endNode);
    
    if (calculatedPath.length === 0) {
      alert('No path found! These locations may not be connected yet.');
      return;
    }

    setPath(calculatedPath);

    // If we just calculated a path, we usually want to see the Start first
    // But since Start is ALWAYS Kiosk, maybe we want to see the Destination?
    // For now, let's keep it jumping to the Kiosk floor (Main Bldg, F0)
    if (graph[startNode]) {
      setActiveFloor(graph[startNode].floor || 0);
      setActiveBuilding(getNodeBuilding(graph[startNode]));
    }
  };

  const clearPath = () => setPath([]);

  // ✅ STRICT FILTER: Only return nodes explicitly marked as 'outdoor'
  const getOutdoorPath = () => {
    return path.filter(nodeId => {
      const node = graph[nodeId];
      return node && node.building === 'outdoor';
    });
  };

  const isCrossBuildingPath = () => {
    if (path.length === 0) return false;
    const buildings = new Set();
    path.forEach(id => { if (graph[id]) buildings.add(getNodeBuilding(graph[id])); });
    buildings.delete('outdoor');
    return buildings.size > 1;
  };

  const jumpToNode = (nodeId) => {
    const node = graph[nodeId];
    if (node) {
      setActiveFloor(node.floor || 0);
      setActiveBuilding(getNodeBuilding(node));
    }
  };

  return {
    graph,
    roomsByBuilding,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    path,
    activeFloor,
    setActiveFloor,
    activeBuilding,
    setActiveBuilding,
    calculatePath,
    clearPath,
    getOutdoorPath,
    isCrossBuildingPath,
    jumpToNode
  };
};