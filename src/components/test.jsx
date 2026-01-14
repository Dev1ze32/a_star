import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  BCH_BUILDING_WIDTH, 
  BCH_BUILDING_HEIGHT,
  BCH_HALL_Y,         // New Import
  BCH_HALL_HEIGHT,    // New Import
  BCH_STAIR_X,
  BCH_STAIR_WIDTH,
  BCH_ELEVATOR_X,
  BCH_ELEVATOR_WIDTH,
} from '../constants/bchBuildingConfig';
import { generatePathSegments } from '../utils/pathfinding';

export const BCHFloorMap = ({ graph, activeFloor, path, startNode, endNode, onNodeClick, designMode }) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const currentNodes = Object.values(graph).filter(n => n.floor === activeFloor);
  const pathSegments = generatePathSegments(path, graph, activeFloor);

  return (
    <div className="relative shadow-2xl border-2 border-slate-300 bg-white rounded-lg overflow-hidden" 
         style={{ width: BCH_BUILDING_WIDTH, height: BCH_BUILDING_HEIGHT }}>
      
      {/* ... (SVG Setup, Grids, etc. same as before) ... */}

      <svg width={BCH_BUILDING_WIDTH} height={BCH_BUILDING_HEIGHT} className="absolute inset-0"
           onMouseMove={(e) => { /* ... design mode logic ... */ }}>
        
        <defs>
          <pattern id="bch-tiles" width="20" height="20" patternUnits="userSpaceOnUse">
             <rect width="20" height="20" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1"/>
          </pattern>
           {/* ... grid pattern ... */}
        </defs>

        {/* Outer Walls */}
        <rect x="20" y="20" width={BCH_BUILDING_WIDTH - 40} height={BCH_BUILDING_HEIGHT - 40} 
              fill="white" stroke="#334155" strokeWidth="8" rx="10" />

        {/* === SINGLE CENTRAL HALLWAY === */}
        <rect 
          x="60" 
          y={BCH_HALL_Y - (BCH_HALL_HEIGHT / 2)} 
          width="1080" 
          height={BCH_HALL_HEIGHT} 
          fill="url(#bch-tiles)" 
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* === STAIRS (Centered in gap) === */}
        <g transform={`translate(${BCH_STAIR_X - BCH_STAIR_WIDTH/2}, ${BCH_HALL_Y - 40})`}>
          <rect width={BCH_STAIR_WIDTH} height="80" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="4" />
          {[...Array(6)].map((_, i) => (
            <line key={i} x1="10" y1={15 + i*10} x2={BCH_STAIR_WIDTH-10} y2={15 + i*10} stroke="#a5b4fc" strokeWidth="2" />
          ))}
          <text x={BCH_STAIR_WIDTH/2} y="95" textAnchor="middle" className="text-xs font-bold fill-indigo-700">STAIRS</text>
        </g>

        {/* === ELEVATOR (Centered in gap) === */}
        <g transform={`translate(${BCH_ELEVATOR_X - BCH_ELEVATOR_WIDTH/2}, ${BCH_HALL_Y - 40})`}>
          <rect width={BCH_ELEVATOR_WIDTH} height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="4" />
          <line x1={BCH_ELEVATOR_WIDTH/2} y1="10" x2={BCH_ELEVATOR_WIDTH/2} y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" />
          <text x={BCH_ELEVATOR_WIDTH/2} y="95" textAnchor="middle" className="text-xs font-bold fill-amber-700">ELEV</text>
        </g>

        {/* Nodes & Path */}
        {currentNodes.map(node => renderBCHNode(node, startNode, endNode, path, onNodeClick, designMode))}
        
        {/* Draw Path Segments */}
        {pathSegments.map((seg, idx) => {
           if (seg.type === 'walk') {
             return <line key={idx} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} 
                    stroke="#2563eb" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />;
           }
           // ... transition logic ...
           return null;
        })}

        {/* ... Design Mode Code ... */}
      </svg>
    </div>
  );
};

// ... renderBCHNode function needs update for door direction ...
const renderBCHNode = (node, startNode, endNode, path, onNodeClick, designMode) => {
    // ... setup ...
    if (['room', 'entrance'].includes(node.type)) {
        // ... colors ...
        return (
            <g onClick={() => onNodeClick(node.id)} className="cursor-pointer">
                {/* Room Rect */}
                {/* Door Indicator Logic Updated for single hall */}
                {node.type === 'room' && (
                    <circle 
                        cx={node.x} 
                        // If room Y is less than Hall Y, door is on bottom. If room is below, door is on top.
                        cy={node.y < BCH_HALL_Y ? node.y + 30 : node.y - 30} 
                        r="3" fill="#64748b" 
                    />
                )}
                {/* ... text ... */}
            </g>
        )
    }
}