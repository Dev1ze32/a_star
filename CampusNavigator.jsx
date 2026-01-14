import React, { useState, useMemo, useRef } from 'react';
import { MapPin, Navigation, Info, Layers, MousePointer2 } from 'lucide-react';

// --- GRAPH GENERATOR CONFIGURATION ---
const CONFIG = {
  roomWidth: 40,
  roomHeight: 30,
  hallwayLength: 30, 
  hallwayWidth: 10,
  floorGap: 180,     
  buildingGap: 400,  
};

export default function CampusNavigator() {
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  
  // Ref for handling drag interactions
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // --- DATA GENERATION (Memoized to prevent regeneration bugs) ---
  const { nodes, edges, width, height, minX, minY } = useMemo(() => {
    const tempNodes = {};
    const tempEdges = [];

    const addNode = (id, label, x, y, floor, type, building) => {
      tempNodes[id] = { id, label, x, y, floor, type, building };
    };

    const addEdge = (from, to, weight) => {
      tempEdges.push({ from, to, weight });
    };

    const generateBuilding = (prefix, name, numFloors, roomsPerFloor, startX, startY) => {
      for (let f = 1; f <= numFloors; f++) {
        const floorLabel = `${name} F${f}`;
        const floorY = startY - ((f - 1) * CONFIG.floorGap);
        
        const stairId = `${prefix}_stair_f${f}`;
        addNode(stairId, 'Stairs', startX, floorY, floorLabel, 'stair', name);

        if (f > 1) {
          const prevStairId = `${prefix}_stair_f${f-1}`;
          addEdge(stairId, prevStairId, 30);
        }

        let prevHallNodeId = stairId;

        for (let r = 0; r < roomsPerFloor; r += 2) {
          const pairIndex = r / 2;
          const hallX = startX + 60 + (pairIndex * CONFIG.hallwayLength);
          
          const hallNodeId = `${prefix}_f${f}_hall_${pairIndex}`;
          addNode(hallNodeId, '', hallX, floorY, floorLabel, 'hall', name);

          addEdge(prevHallNodeId, hallNodeId, 5);
          prevHallNodeId = hallNodeId;

          const roomNumBase = (f * 100) + r + 1;
          
          const roomTopId = `${prefix}_room_${roomNumBase}`;
          addNode(roomTopId, `${roomNumBase}`, hallX, floorY - 40, floorLabel, 'room', name);
          addEdge(hallNodeId, roomTopId, 10);

          const roomBotId = `${prefix}_room_${roomNumBase + 1}`;
          addNode(roomBotId, `${roomNumBase + 1}`, hallX, floorY + 40, floorLabel, 'room', name);
          addEdge(hallNodeId, roomBotId, 10);
        }
      }
    };

    generateBuilding('main', 'Main', 4, 16, 50, 1000);
    generateBuilding('bch', 'BCH', 6, 16, 550, 1360);

    const walkwayId = 'campus_walkway';
    const mainExit = tempNodes['main_stair_f1'];
    const bchExit = tempNodes['bch_stair_f1'];

    addNode(walkwayId, 'Connector Path', (mainExit.x + bchExit.x) / 2, (mainExit.y + bchExit.y) / 2, 'Outside', 'hall', 'Outside');
    addEdge('main_stair_f1', walkwayId, 50);
    addEdge(walkwayId, 'bch_stair_f1', 50);

    const allX = Object.values(tempNodes).map(n => n.x);
    const allY = Object.values(tempNodes).map(n => n.y);
    const minXVal = Math.min(...allX) - 50;
    const maxXVal = Math.max(...allX) + 150;
    const minYVal = Math.min(...allY) - 50;
    const maxYVal = Math.max(...allY) + 50;

    return {
      nodes: tempNodes,
      edges: tempEdges,
      width: maxXVal - minXVal,
      height: maxYVal - minYVal,
      minX: minXVal,
      minY: minYVal
    };
  }, []);

  // --- PATHFINDING ---
  const path = useMemo(() => {
    if (!startNode || !endNode) return null;

    const getNeighbors = (nodeId) => {
      const neighbors = [];
      edges.forEach(edge => {
        if (edge.from === nodeId) neighbors.push({ id: edge.to, weight: edge.weight });
        if (edge.to === nodeId) neighbors.push({ id: edge.from, weight: edge.weight });
      });
      return neighbors;
    };

    const heuristic = (idA, idB) => {
      const a = nodes[idA];
      const b = nodes[idB];
      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    };

    const openSet = [startNode];
    const cameFrom = {};
    const gScore = {}; 
    const fScore = {}; 

    Object.keys(nodes).forEach(id => {
      gScore[id] = Infinity;
      fScore[id] = Infinity;
    });

    gScore[startNode] = 0;
    fScore[startNode] = heuristic(startNode, endNode);

    while (openSet.length > 0) {
      let current = openSet.reduce((lowest, node) => 
        fScore[node] < fScore[lowest] ? node : lowest
      , openSet[0]);

      if (current === endNode) {
        const totalPath = [current];
        while (cameFrom[current]) {
          current = cameFrom[current];
          totalPath.unshift(current);
        }
        return totalPath;
      }

      openSet.splice(openSet.indexOf(current), 1);

      const neighbors = getNeighbors(current);
      for (let neighbor of neighbors) {
        const tentativeGScore = gScore[current] + neighbor.weight;

        if (tentativeGScore < gScore[neighbor.id]) {
          cameFrom[neighbor.id] = current;
          gScore[neighbor.id] = tentativeGScore;
          fScore[neighbor.id] = gScore[neighbor.id] + heuristic(neighbor.id, endNode);
          
          if (!openSet.includes(neighbor.id)) {
            openSet.push(neighbor.id);
          }
        }
      }
    }
    return null;
  }, [startNode, endNode, nodes, edges]);

  // --- INTERACTION HANDLERS ---

  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    
    isDraggingRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDraggingRef.current = true;
      if (containerRef.current) {
        containerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
        containerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleNodeClick = (id, e) => {
    if (e) e.stopPropagation();
    
    if (isDraggingRef.current) {
      return;
    }

    if (!startNode) {
      setStartNode(id);
    } else if (!endNode) {
      if (id !== startNode) setEndNode(id);
    } else {
      setStartNode(id);
      setEndNode(null);
    }
  };

  const getEdgeColor = (from, to) => {
    if (!path) return '#e5e7eb'; 
    const fromIndex = path.indexOf(from);
    const toIndex = path.indexOf(to);
    if (fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1) {
      return '#3b82f6'; 
    }
    return '#e5e7eb';
  };

  const getNodeColor = (id) => {
    if (id === startNode) return 'bg-green-500 ring-4 ring-green-200 z-50';
    if (id === endNode) return 'bg-red-500 ring-4 ring-red-200 z-50';
    if (path && path.includes(id)) return 'bg-blue-500 z-40';
    
    const type = nodes[id].type;
    if (type === 'stair') return 'bg-purple-500 w-4 h-4';
    if (type === 'hall') return 'bg-gray-200 w-2 h-2';
    return 'bg-white border-2 border-gray-400 text-gray-700';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans overflow-hidden select-none">
      
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="text-blue-600" />
            Campus Navigator: Exploded View
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Main Building (4 Floors) & BCH Building (6 Floors) • Face-to-Face Rooms
          </p>
        </div>
        
        <div className="flex gap-4 text-sm">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-full"></div> Start
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-500 rounded-full"></div> End
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-purple-500 rounded-full"></div> Stairs
           </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-50 relative cursor-move active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-3 rounded-lg border shadow-sm text-xs pointer-events-none">
            <p className="font-bold flex items-center gap-2">
              <MousePointer2 className="w-3 h-3" /> Navigation Instructions:
            </p>
            <ol className="list-decimal ml-4 space-y-1 mt-2">
              <li><span className="font-semibold text-slate-700">Drag</span> anywhere to pan the map.</li>
              <li>Click a <span className="text-green-600 font-bold">Start Node</span> (Green)</li>
              <li>Click a <span className="text-red-600 font-bold">Destination</span> (Red)</li>
            </ol>
          </div>

          <svg 
            width={width} 
            height={height} 
            viewBox={`${minX} ${minY} ${width} ${height}`}
            className="min-w-full min-h-full"
            onDragStart={(e) => e.preventDefault()} 
          >
            {Object.values(nodes).filter(n => n.type === 'stair').map(stair => (
               <rect 
                  key={`floor_${stair.id}`}
                  x={stair.x - 20}
                  y={stair.y - 60}
                  width={400} 
                  height={120}
                  fill={stair.building === 'Main' ? '#f0f9ff' : '#fff7ed'} 
                  rx="10"
                  opacity="0.5"
                  stroke={stair.building === 'Main' ? '#bae6fd' : '#fed7aa'}
               />
            ))}

            {edges.map((edge, i) => {
              const n1 = nodes[edge.from];
              const n2 = nodes[edge.to];
              return (
                <line 
                  key={i}
                  x1={n1.x} y1={n1.y} 
                  x2={n2.x} y2={n2.y} 
                  stroke={getEdgeColor(edge.from, edge.to)} 
                  strokeWidth={n1.type === 'hall' && n2.type === 'hall' ? 6 : 2}
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                />
              );
            })}

            {Object.values(nodes).map((node) => {
              const isRoom = node.type === 'room';
              return (
                <g 
                  key={node.id} 
                  onClick={(e) => handleNodeClick(node.id, e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="cursor-pointer group"
                  onDragStart={(e) => e.preventDefault()}
                >
                  {isRoom ? (
                    <rect 
                      x={node.x - 12} y={node.y - 10} 
                      width="24" height="20" 
                      rx="4"
                      className={`${getNodeColor(node.id)} shadow-sm transition-all hover:scale-110`}
                    />
                  ) : (
                    <circle 
                      cx={node.x} cy={node.y} 
                      r={node.type === 'stair' ? 8 : 4}
                      className={`${getNodeColor(node.id)} shadow-sm transition-all hover:scale-110`}
                    />
                  )}

                  {isRoom && (
                    <text 
                      x={node.x} y={node.y + 4} 
                      textAnchor="middle" 
                      fontSize="9" 
                      className="font-bold fill-gray-600 pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                  )}
                  {node.type === 'stair' && (
                    <text 
                      x={node.x - 10} y={node.y} 
                      textAnchor="end" 
                      fontSize="10" 
                      className="font-bold fill-purple-600 pointer-events-none select-none"
                    >
                      {node.floor}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col gap-4 overflow-y-auto shadow-xl z-20 shrink-0">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
             <h3 className="font-bold text-blue-900 flex items-center gap-2">
               <Layers className="w-4 h-4"/> Building Layout
             </h3>
             <p className="text-xs text-blue-700 mt-1">
               <strong>Main Building:</strong> 4 Floors<br/>
               <strong>BCH Building:</strong> 6 Floors<br/>
               <strong>Layout:</strong> Central Hallway with Face-to-Face rooms.
             </p>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Trip Details
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="p-3 bg-gray-50 rounded border flex justify-between">
                <span className="text-xs text-gray-500 uppercase">Start</span>
                <span className="font-bold text-sm text-gray-800">
                  {startNode ? `${nodes[startNode].building} ${nodes[startNode].label}` : 'Select...'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded border flex justify-between">
                <span className="text-xs text-gray-500 uppercase">End</span>
                <span className="font-bold text-sm text-gray-800">
                  {endNode ? `${nodes[endNode].building} ${nodes[endNode].label}` : 'Select...'}
                </span>
              </div>
              <button 
                onClick={() => { setStartNode(null); setEndNode(null); }}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-semibold transition-colors"
              >
                Reset Selection
              </button>
            </div>

            {path && (
              <div className="animate-fade-in">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Route Guide</h4>
                <div className="flex flex-col gap-1 text-xs text-gray-600 max-h-[40vh] overflow-y-auto border-t pt-2">
                  {path.map((id, idx) => {
                     const node = nodes[id];
                     if (node.type === 'hall') return null; 
                     
                     return (
                       <div key={idx} className="flex items-center gap-2 py-1">
                         <div className={`w-2 h-2 rounded-full ${node.type === 'stair' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                         <span className={node.type === 'stair' ? 'font-bold text-purple-700' : ''}>
                           {node.type === 'stair' ? `Take Stairs (${node.floor})` : `Go to Room ${node.label}`}
                         </span>
                       </div>
                     )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}