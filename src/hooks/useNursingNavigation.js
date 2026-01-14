import { useState, useMemo } from 'react';
import { generateNursingBuildingGraph } from '../utils/nursingGraphGenerator';
import { findPath } from '../utils/pathfinding';

export const useNursingNavigation = () => {
  const [startNode, setStartNode] = useState('Nursing Entrance');
  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState([]);
  const [activeFloor, setActiveFloor] = useState(0);

  const graph = useMemo(() => generateNursingBuildingGraph(), []);
  
  const rooms = useMemo(() => {
    return Object.values(graph)
      .filter(n => ['room', 'library', 'entrance'].includes(n.type))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [graph]);

  const calculatePath = () => {
    if (startNode && endNode) {
      const calculatedPath = findPath(graph, startNode, endNode);
      setPath(calculatedPath);
      if (graph[startNode]) {
        setActiveFloor(graph[startNode].floor);
      }
    }
  };

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