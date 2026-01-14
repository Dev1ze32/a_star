const heuristic = (nodeA, nodeB) => {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  const df = Math.abs(nodeA.floor - nodeB.floor) * 1000; 
  return Math.sqrt(dx * dx + dy * dy) + df;
};

export const findPath = (nodes, startId, endId) => {
  if (!nodes[startId] || !nodes[endId]) return [];

  let openSet = [startId];
  let cameFrom = {};
  let gScore = {}; 
  let fScore = {}; 
  
  Object.keys(nodes).forEach(key => {
    gScore[key] = Infinity;
    fScore[key] = Infinity;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(nodes[startId], nodes[endId]);

  while (openSet.length > 0) {
    let current = openSet.reduce((acc, node) => 
      fScore[node] < fScore[acc] ? node : acc, openSet[0]
    );

    if (current === endId) {
      return reconstructPath(cameFrom, current);
    }

    openSet = openSet.filter(n => n !== current);

    for (let neighborId of nodes[current].neighbors) {
      const tentativeGScore = gScore[current] + calculateWeight(nodes[current], nodes[neighborId]);

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = current;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = gScore[neighborId] + heuristic(nodes[neighborId], nodes[endId]);
        
        if (!openSet.includes(neighborId)) {
          openSet.push(neighborId);
        }
      }
    }
  }
  
  return [];
};

const calculateWeight = (currentNode, neighborNode) => {
  const dist = Math.sqrt(
    Math.pow(neighborNode.x - currentNode.x, 2) + 
    Math.pow(neighborNode.y - currentNode.y, 2)
  );
  const floorDiff = Math.abs(neighborNode.floor - currentNode.floor);
  return dist + (floorDiff * 50);
};

const reconstructPath = (cameFrom, current) => {
  let totalPath = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
};

export const generatePathSegments = (path, graph, activeFloor) => {
  const segments = [];
  
  for (let i = 0; i < path.length - 1; i++) {
    const currId = path[i];
    const nextId = path[i + 1];
    const n1 = graph[currId];
    const n2 = graph[nextId];

    if (n1.floor === activeFloor && n2.floor === activeFloor) {
      segments.push({ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y, type: 'walk' });
    } else if (n1.floor === activeFloor && n2.floor !== activeFloor) {
      const direction = n2.floor > n1.floor ? 'UP' : 'DOWN';
      segments.push({ x1: n1.x, y1: n1.y, x2: n1.x, y2: n1.y, type: 'transition', direction });
    }
  }
  
  return segments;
};