import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { 
  BCH_BUILDING_WIDTH, 
  BCH_BUILDING_HEIGHT,
  BCH_HALL_Y,         
  BCH_HALL_HEIGHT,    
  BCH_STAIR_X,
  BCH_STAIR_WIDTH,
  BCH_STAIR_Y,        // ✅ NEW IMPORT
  BCH_ELEVATOR_X,
  BCH_ELEVATOR_WIDTH,
  BCH_ELEVATOR_Y      // ✅ NEW IMPORT
} from '../constants/bchBuildingConfig';
import { generatePathSegments } from '../utils/pathfinding';
/**
 * ═══════════════════════════════════════════════════════════════════
 * BCH FLOOR MAP COMPONENT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This component renders the visual representation of a single floor.
 * 
 * FEATURES:
 * - Shows rooms, hallways, stairs, elevator
 * - Displays calculated paths
 * - Supports design mode with coordinates
 * - Clickable rooms for destination selection
 * 
 * TO ADJUST VISUAL APPEARANCE:
 * - Change colors in the SVG elements below
 * - Modify room sizes in renderBCHNode function
 * - Adjust stroke widths, fills, etc.
 * ═══════════════════════════════════════════════════════════════════
 */

export const BCHFloorMap = ({ 
  graph, 
  activeFloor, 
  path, 
  startNode, 
  endNode, 
  onNodeClick,
  designMode 
}) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  
  // Filter nodes for current floor only
  const currentNodes = Object.values(graph).filter(n => n.floor === activeFloor);
  
  // Generate path segments for visualization
  const pathSegments = generatePathSegments(path, graph, activeFloor);
  
  // Display floor number (Ground = 0, others = 1,2,3,4)
  const floorNum = activeFloor + 1;

  return (
    <div 
      className="relative shadow-2xl border-2 border-slate-300 bg-white rounded-lg overflow-hidden" 
      style={{ width: BCH_BUILDING_WIDTH, height: BCH_BUILDING_HEIGHT }}
    >
      
      {/* Watermark Floor Number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="text-9xl font-black">
          {activeFloor === 0 ? 'G' : floorNum}F
        </span>
      </div>

      <svg 
        width={BCH_BUILDING_WIDTH} 
        height={BCH_BUILDING_HEIGHT} 
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
        {/* ══════════════════════════════════════════════════════ */}
        {/* PATTERN DEFINITIONS */}
        {/* ══════════════════════════════════════════════════════ */}
        <defs>
          {/* Grid pattern for background */}
          <pattern id="bch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
          
          {/* Floor tile pattern for hallways */}
          <pattern id="bch-tiles" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1"/>
          </pattern>
        </defs>
        
        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#bch-grid)" />

        {/* ══════════════════════════════════════════════════════ */}
        {/* BUILDING STRUCTURE */}
        {/* ══════════════════════════════════════════════════════ */}
        
        {/* Outer Walls */}
        <rect 
          x="20" 
          y="20" 
          width={BCH_BUILDING_WIDTH - 40} 
          height={BCH_BUILDING_HEIGHT - 40} 
          fill="none" 
          stroke="#334155" 
          strokeWidth="8" 
          rx="10" 
        />
        
        {/* ══════════════════════════════════════════════════════ */}
        {/* HALLWAYS */}
        {/* ══════════════════════════════════════════════════════ */}
        
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

        {/* ══════════════════════════════════════════════════════ */}
        {/* STAIRS */}
        {/* ══════════════════════════════════════════════════════ */}
        <g transform={`translate(${BCH_STAIR_X - BCH_STAIR_WIDTH/2}, ${BCH_STAIR_Y - 40})`}>
          <rect width={BCH_STAIR_WIDTH} height="80" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="4" />
          {[...Array(6)].map((_, i) => (
            <line key={i} x1="10" y1={15 + i*10} x2={BCH_STAIR_WIDTH-10} y2={15 + i*10} stroke="#a5b4fc" strokeWidth="2" />
          ))}
          <text x={BCH_STAIR_WIDTH/2} y="95" textAnchor="middle" className="text-xs font-bold fill-indigo-700">STAIRS</text>
        </g>

        {/* ══════════════════════════════════════════════════════ */}
        {/* ELEVATOR */}
        {/* ══════════════════════════════════════════════════════ */}
        <g transform={`translate(${BCH_ELEVATOR_X - BCH_ELEVATOR_WIDTH/2}, ${BCH_ELEVATOR_Y - 40})`}>
          <rect width={BCH_ELEVATOR_WIDTH} height="80" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" rx="4" />
          <line x1={BCH_ELEVATOR_WIDTH/2} y1="10" x2={BCH_ELEVATOR_WIDTH/2} y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" />
          <text x={BCH_ELEVATOR_WIDTH/2} y="95" textAnchor="middle" className="text-xs font-bold fill-amber-700">ELEV</text>
        </g>

        {/* ══════════════════════════════════════════════════════ */}
        {/* RENDER ALL NODES (Rooms, Hallways, etc.) */}
        {/* ══════════════════════════════════════════════════════ */}
        {currentNodes.map(node => renderBCHNode(node, startNode, endNode, path, onNodeClick, designMode))}

        {/* ══════════════════════════════════════════════════════ */}
        {/* PATH VISUALIZATION */}
        {/* ══════════════════════════════════════════════════════ */}
        {pathSegments.map((seg, idx) => {
          if (seg.type === 'walk') {
            // Draw walking path
            return (
              <line 
                key={idx} 
                x1={seg.x1} 
                y1={seg.y1} 
                x2={seg.x2} 
                y2={seg.y2} 
                stroke="#2563eb" 
                strokeWidth="4" 
                strokeDasharray="8 4" 
                className="animate-pulse" 
              />
            );
          }
          
          if (seg.type === 'transition') {
            // Draw floor transition indicator
            return (
              <g key={`trans-${idx}`} transform={`translate(${seg.x1}, ${seg.y1})`}>
                <circle r="15" fill="#f59e0b" className="animate-ping absolute" opacity="0.7" />
                <circle r="15" fill="#f59e0b" stroke="white" strokeWidth="2" />
                {seg.direction === 'UP' ? 
                  <ChevronUp className="w-6 h-6 text-white -ml-3 -mt-3" /> : 
                  <ChevronDown className="w-6 h-6 text-white -ml-3 -mt-3" />
                }
                <text y="-20" textAnchor="middle" className="fill-amber-700 font-bold text-sm">
                  GO {seg.direction}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* ══════════════════════════════════════════════════════ */}
        {/* DESIGN MODE CROSSHAIR */}
        {/* ══════════════════════════════════════════════════════ */}
        {designMode && (
          <g style={{ pointerEvents: 'none' }}>
            <line 
              x1={cursor.x} 
              y1="0" 
              x2={cursor.x} 
              y2={BCH_BUILDING_HEIGHT} 
              stroke="red" 
              strokeWidth="1" 
              strokeDasharray="4 2" 
              opacity="0.5" 
            />
            <line 
              x1="0" 
              y1={cursor.y} 
              x2={BCH_BUILDING_WIDTH} 
              y2={cursor.y} 
              stroke="red" 
              strokeWidth="1" 
              strokeDasharray="4 2" 
              opacity="0.5" 
            />
            <circle cx={cursor.x} cy={cursor.y} r="5" fill="none" stroke="red" strokeWidth="2" />
            
            {/* Coordinate Display */}
            <rect 
              x={cursor.x + 10} 
              y={cursor.y - 30} 
              width="100" 
              height="25" 
              fill="black" 
              opacity="0.7" 
              rx="4" 
            />
            <text 
              x={cursor.x + 60} 
              y={cursor.y - 13} 
              textAnchor="middle" 
              fill="white" 
              fontSize="12" 
              fontWeight="bold" 
              fontFamily="monospace"
            >
              X:{cursor.x} Y:{cursor.y}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════
 * RENDER BCH NODE FUNCTION
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This function renders individual nodes (rooms, hallways, etc.)
 * 
 * TO CUSTOMIZE NODE APPEARANCE:
 * - Change colors for different node types
 * - Adjust room sizes (width/height)
 * - Modify stroke widths, borders, etc.
 */
const renderBCHNode = (node, startNode, endNode, path, onNodeClick, designMode) => {
  const isStart = node.id === startNode;
  const isEnd = node.id === endNode;
  const isPath = path.includes(node.id);
  
  // Don't render hallway nodes unless in design mode
  if (node.type === 'hall') {
    return designMode ? (
      <circle 
        key={node.id} 
        cx={node.x} 
        cy={node.y} 
        r="3" 
        fill="gray" 
        opacity="0.5"
      />
    ) : null;
  }
  
  // Don't render stair/elevator nodes (they're drawn separately above)
  if (node.type === 'stair' || node.type === 'elevator') {
    return designMode ? (
      <circle 
        key={node.id} 
        cx={node.x} 
        cy={node.y} 
        r="5" 
        fill={node.type === 'stair' ? 'blue' : 'orange'} 
        opacity="0.8"
      />
    ) : null;
  }

  // Render rooms and entrance
  if (['room', 'entrance'].includes(node.type)) {
    // Determine color based on state
    let color = 'white';
    if (isStart) color = '#4ade80';        // Green for start
    else if (isEnd) color = '#f87171';     // Red for end
    else if (isPath) color = '#bfdbfe';    // Blue for path
    else if (node.type === 'entrance') color = '#fef3c7'; // Yellow for entrance

    // Determine size
    let width = 60;
    let height = 60;
    if (node.type === 'entrance') {
      width = 80;
      height = 40;
    }

    return (
      <g 
        key={node.id} 
        onClick={() => onNodeClick(node.id)} 
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        {/* Room Rectangle */}
        <rect 
          x={node.x - width/2} 
          y={node.y - height/2} 
          width={width} 
          height={height} 
          fill={color} 
          stroke={isPath ? '#3b82f6' : '#94a3b8'} 
          strokeWidth={isPath ? 3 : 2} 
          rx="4" 
        />
        
        {/* Room Label */}
        <text 
          x={node.x} 
          y={node.y} 
          dy=".3em" 
          textAnchor="middle" 
          className="text-sm font-bold fill-slate-700 pointer-events-none"
        >
          {node.label || node.id}
        </text>
        
        {/* Door indicator (for rooms only) */}
        {node.type === 'room' && (
          <circle 
            cx={node.x} 
            cy={node.y < BCH_HALL_Y ? node.y + 30 : node.y - 30} 
            r="3" 
            fill="#64748b" 
          />
        )}
      </g>
    );
  }
  
  return null;
};