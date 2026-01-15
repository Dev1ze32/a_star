import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { BUILDING_WIDTH, BUILDING_HEIGHT } from '../constants/buildingConfig';
import { generatePathSegments } from '../utils/pathfinding';

export const FloorMap = ({ 
  graph, 
  activeFloor, 
  path, 
  startNode, 
  endNode, 
  onNodeClick,
  designMode 
}) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  
  // ✅ STRICT FILTER: Exclude BCH and Nursing nodes by ID
  const currentNodes = Object.values(graph).filter(n => {
    const id = n.id.toString();
    const isOtherBuilding = id.includes('BCH') || id.includes('Nursing') || id.startsWith('NF');
    return n.floor === activeFloor && !isOtherBuilding;
  });

  // ✅ Pass 'main' to stop ghost paths
  const pathSegments = generatePathSegments(path, graph, activeFloor, 'main');

  return (
    <div className="relative shadow-2xl border-2 border-slate-300 bg-white rounded-lg overflow-hidden" 
         style={{ width: BUILDING_WIDTH, height: BUILDING_HEIGHT }}>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="text-9xl font-black">{activeFloor === 0 ? 'G' : activeFloor}</span>
      </div>

      <svg 
        width={BUILDING_WIDTH} 
        height={BUILDING_HEIGHT} 
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
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
          <pattern id="tiles" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1"/>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect x="20" y="20" width={BUILDING_WIDTH - 40} height={BUILDING_HEIGHT - 40} 
              fill="none" stroke="#334155" strokeWidth="8" rx="10" />
        
        {/* Hardcoded SVG Elements (Stairs, Hallways) */}
        <rect x="30" y="150" width="80" height="100" fill="#e2e8f0" stroke="#cbd5e1" />
        <text x="70" y="205" textAnchor="middle" className="text-xs font-bold fill-slate-500 pointer-events-none">STAIR L</text>
        
        <rect x="890" y="150" width="80" height="100" fill="#e2e8f0" stroke="#cbd5e1" />
        <text x="930" y="205" textAnchor="middle" className="text-xs font-bold fill-slate-500 pointer-events-none">STAIR R</text>

        {activeFloor === 0 ? (
          <g>
            <rect x="350" y="50" width="80" height="100" fill="#e2e8f0" stroke="#cbd5e1" />
            <text x="390" y="105" textAnchor="middle" className="text-xs font-bold fill-slate-500 pointer-events-none">STAIR M</text>
            <rect x="110" y="180" width="780" height="40" fill="url(#tiles)" stroke="black" />
            <rect x="450" y="50" width="40" height="130" fill="url(#tiles)" stroke="none" />
            <line x1="450" y1="50" x2="450" y2="180" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="490" y1="50" x2="490" y2="180" stroke="#cbd5e1" strokeWidth="2" />
          </g>
        ) : (
          <g>
            <rect x="350" y="50" width="80" height="100" fill="#e2e8f0" stroke="#cbd5e1" />
            <text x="390" y="105" textAnchor="middle" className="text-xs font-bold fill-slate-500 pointer-events-none">STAIR M</text>
          </g>
        )}

        <rect x="110" y="180" width="780" height="40" fill="#f1f5f9" stroke="none" opacity={activeFloor === 0 ? 0.5 : 1} />

        {/* Dynamic Nodes */}
        {currentNodes.map(node => renderNode(node, startNode, endNode, path, onNodeClick, designMode))}

        {/* Path Segments */}
        {pathSegments.map((seg, idx) => {
          if (seg.type === 'walk') {
            return <line key={idx} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} 
                        stroke="#2563eb" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />;
          }
          if (seg.type === 'transition') {
            return (
              <g key={`trans-${idx}`} transform={`translate(${seg.x1}, ${seg.y1})`}>
                <circle r="15" fill="#f59e0b" className="animate-ping absolute" opacity="0.7" />
                <circle r="15" fill="#f59e0b" stroke="white" strokeWidth="2" />
                {seg.direction === 'UP' ? 
                  <ChevronUp className="w-6 h-6 text-white -ml-3 -mt-3" /> : 
                  <ChevronDown className="w-6 h-6 text-white -ml-3 -mt-3" />
                }
                <text y="-20" textAnchor="middle" className="fill-amber-700 font-bold text-sm bg-white">
                  GO {seg.direction}
                </text>
              </g>
            );
          }
          return null;
        })}

        {designMode && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={cursor.x} y1="0" x2={cursor.x} y2={BUILDING_HEIGHT} stroke="red" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            <line x1="0" y1={cursor.y} x2={BUILDING_WIDTH} y2={cursor.y} stroke="red" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            <text x={cursor.x + 10} y={cursor.y - 10} fill="red" fontSize="12">X:{cursor.x} Y:{cursor.y}</text>
          </g>
        )}
      </svg>
    </div>
  );
};

const renderNode = (node, startNode, endNode, path, onNodeClick, designMode) => {
  const isStart = node.id === startNode;
  const isEnd = node.id === endNode;
  const isPath = path.includes(node.id);
  
  if (node.type === 'hall') return designMode ? <circle key={node.id} cx={node.x} cy={node.y} r="3" fill="gray" opacity="0.5"/> : null;
  if (node.type === 'stair') return designMode ? <circle key={node.id} cx={node.x} cy={node.y} r="5" fill="orange" opacity="0.8"/> : null;

  if (['room', 'kiosk', 'exit'].includes(node.type)) {
    let color = 'white';
    if (isStart) color = '#4ade80';
    else if (isEnd) color = '#f87171';
    else if (isPath) color = '#bfdbfe';

    return (
      <g key={node.id} onClick={() => onNodeClick(node.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
        {node.type === 'exit' ? (
          <>
            <rect x={node.x - 40} y={node.y - 15} width="80" height="30" fill="#ef4444" rx="4" />
            <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-xs font-bold fill-white pointer-events-none">BACK EXIT</text>
          </>
        ) : (
          <>
            <rect x={node.x - 30} y={node.y - 30} width="60" height="60" fill={color} stroke={isPath ? '#3b82f6' : '#94a3b8'} strokeWidth={isPath ? 3 : 2} rx="4" />
            <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-xs font-bold fill-slate-700 pointer-events-none">{node.label || node.id}</text>
          </>
        )}
        {node.type !== 'exit' && <circle cx={node.x} cy={node.y > 200 ? node.y - 30 : node.y + 30} r="3" fill="#64748b" />}
      </g>
    );
  }
  return null;
};