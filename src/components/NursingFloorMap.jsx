import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  NURSING_BUILDING_WIDTH, 
  NURSING_BUILDING_HEIGHT,
  NURSING_HALL_Y,
  NURSING_FLOOR_CONFIG 
} from '../constants/nursingBuildingConfig';
import { generatePathSegments } from '../utils/pathfinding';

export const NursingFloorMap = ({ 
  graph, 
  activeFloor, 
  path, 
  startNode, 
  endNode, 
  onNodeClick,
  designMode 
}) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  
  const currentNodes = Object.values(graph).filter(n => n.floor == activeFloor);
  const pathSegments = generatePathSegments(path, graph, activeFloor);
  
  const floorNum = activeFloor + 1;
  const floorConfig = NURSING_FLOOR_CONFIG[floorNum];

  return (
    <div className="relative shadow-2xl border-2 border-slate-300 bg-white rounded-lg overflow-hidden" 
         style={{ width: NURSING_BUILDING_WIDTH, height: NURSING_BUILDING_HEIGHT }}>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="text-9xl font-black">F{floorNum}</span>
      </div>

      <svg 
        width={NURSING_BUILDING_WIDTH} 
        height={NURSING_BUILDING_HEIGHT} 
        className="absolute inset-0"
        onMouseMove={(e) => {
          if (!designMode) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setCursor({ 
            x: Math.round(e.clientX - rect.left), 
            y: Math.round(e.clientY - rect.top) 
          });
        }}
      >
        <defs>
          <pattern id="nursing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
          <pattern id="library-tiles" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#nursing-grid)" />

        {/* Building Walls */}
        <rect x="20" y="20" width={NURSING_BUILDING_WIDTH - 40} height={NURSING_BUILDING_HEIGHT - 40} 
              fill="none" stroke="#334155" strokeWidth="8" rx="10" />
        
        {/* Stairs */}
        <rect x="30" y={NURSING_HALL_Y - 60} width="80" height="100" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="70" y={NURSING_HALL_Y - 5} textAnchor="middle" className="text-xs font-bold fill-blue-700 pointer-events-none">
          STAIR L
        </text>
        
        <rect x="890" y={NURSING_HALL_Y - 60} width="80" height="100" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
        <text x="930" y={NURSING_HALL_Y - 5} textAnchor="middle" className="text-xs font-bold fill-blue-700 pointer-events-none">
          STAIR R
        </text>

        {/* Hallway Corridor */}
        <rect x="110" y={NURSING_HALL_Y - 20} width="780" height="40" fill="#dcfce7" stroke="none" />

        {/* Library Floor Special Visual (Floor 2) */}
        {floorConfig?.type === 'library' && (
          <g>
            <rect x="150" y="50" width="700" height="180" fill="url(#library-tiles)" stroke="#f59e0b" strokeWidth="3" rx="8" />
            <text x="500" y="140" textAnchor="middle" className="text-4xl font-bold fill-amber-700 pointer-events-none">
              📚 LIBRARY
            </text>
          </g>
        )}

        {/* Nodes */}
        {currentNodes.map(node => renderNursingNode(node, startNode, endNode, path, onNodeClick, designMode))}

        {/* Path Visualization */}
        {pathSegments.map((seg, idx) => {
          if (seg.type === 'walk') {
            return <line key={idx} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} 
                        stroke="#5910b9" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />;
          }
          if (seg.type === 'transition') {
            return (
              <g key={`trans-${idx}`} transform={`translate(${seg.x1}, ${seg.y1})`}>
                <circle r="15" fill="#10b981" className="animate-ping absolute" opacity="0.7" />
                <circle r="15" fill="#10b981" stroke="white" strokeWidth="2" />
                {seg.direction === 'UP' ? 
                  <ChevronUp className="w-6 h-6 text-white -ml-3 -mt-3" /> : 
                  <ChevronDown className="w-6 h-6 text-white -ml-3 -mt-3" />
                }
                <text y="-20" textAnchor="middle" className="fill-green-700 font-bold text-sm">
                  GO {seg.direction}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* Design Mode Crosshair */}
        {designMode && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={cursor.x} y1="0" x2={cursor.x} y2={NURSING_BUILDING_HEIGHT} 
                  stroke="red" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            <line x1="0" y1={cursor.y} x2={NURSING_BUILDING_WIDTH} y2={cursor.y} 
                  stroke="red" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            <circle cx={cursor.x} cy={cursor.y} r="5" fill="none" stroke="red" strokeWidth="2" />
            <rect x={cursor.x + 10} y={cursor.y - 30} width="100" height="25" fill="black" opacity="0.7" rx="4" />
            <text x={cursor.x + 60} y={cursor.y - 13} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">
              X:{cursor.x} Y:{cursor.y}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

const renderNursingNode = (node, startNode, endNode, path, onNodeClick, designMode) => {
  const isStart = node.id === startNode;
  const isEnd = node.id === endNode;
  const isPath = path.includes(node.id);
  
  if (node.type === 'hall') {
    return designMode ? <circle key={node.id} cx={node.x} cy={node.y} r="3" fill="gray" opacity="0.5"/> : null;
  }
  
  if (node.type === 'stair') {
    return designMode ? <circle key={node.id} cx={node.x} cy={node.y} r="5" fill="blue" opacity="0.8"/> : null;
  }

  if (['room', 'library', 'entrance'].includes(node.type)) {
    // 1. Set Size FIRST based on type
    let width = 60;
    let height = 60;
    
    if (node.type === 'library') {
      width = 120;
      height = 80;
    }

    // 2. Set Color SECOND based on state (Order matters!)
    let color = 'white';
    if (isStart) color = '#86efac';
    else if (isEnd) color = '#fca5a5';
    else if (isPath) color = '#d9f99d'; // Path color now applies without resetting size
    else if (node.type === 'library') color = '#fef3c7';
    else if (node.type === 'entrance') color = '#bfdbfe';

    return (
      <g key={node.id} onClick={() => onNodeClick(node.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
        <rect 
          x={node.x - width/2} 
          y={node.y - height/2} 
          width={width} 
          height={height} 
          fill={color} 
          stroke={isPath ? '#10b981' : '#94a3b8'} 
          strokeWidth={isPath ? 3 : 2} 
          rx="6" 
        />
        <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-sm font-bold fill-slate-700 pointer-events-none">
          {node.label || node.id}
        </text>
        {node.type === 'room' && (
          <circle cx={node.x} cy={node.y + 35} r="3" fill="#64748b" />
        )}
      </g>
    );
  }
  
  return null;
};