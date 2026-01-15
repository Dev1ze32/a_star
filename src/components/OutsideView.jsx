import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import { Building } from './Building';
import { BUILDINGS, CAMPUS_WIDTH, CAMPUS_HEIGHT } from '../constants/buildingsConfig';
import { ROAD_SEGMENTS, OUTDOOR_NODES } from '../constants/outdoorConfig';
import { generatePathSegments } from '../utils/pathfinding';
import { ResponsiveMapContainer } from './ResponsiveMapContainer'; // ✅ IMPORT THIS

export const OutsideView = ({ onEnterBuilding, outdoorPath, graph }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [designMode, setDesignMode] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const pathSegments = outdoorPath && graph ? 
    generatePathSegments(outdoorPath, graph, 0) : [];

  const handleBuildingClick = (building) => {
    if (building.hasGraph) {
      onEnterBuilding(building.id);
    } else {
      alert(`${building.name} is under construction. Coming soon!`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-200 to-sky-100 relative overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════ */}
      {/* HEADER (Fixed Height)                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-4 shadow-lg z-10 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">University Campus Map</h1>
          <p className="text-slate-600 text-xs">Click on any building to explore</p>
        </div>
        
        <button 
          onClick={() => setDesignMode(!designMode)}
          className={`p-2 rounded-lg border-2 transition-all ${
            designMode 
              ? 'bg-amber-100 border-amber-500 text-amber-700' 
              : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
          }`}
          title="Toggle Design Mode"
        >
          <PenTool className="w-5 h-5" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MAP AREA (Dynamic Scaling)                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
        
        {/* ✅ WRAPPER: Forces map to fit available space */}
        <ResponsiveMapContainer originalWidth={CAMPUS_WIDTH} originalHeight={CAMPUS_HEIGHT}>
          
          <div 
            className="relative bg-green-200 rounded-3xl shadow-2xl border-4 border-green-700 overflow-hidden"
            style={{ 
              width: CAMPUS_WIDTH, 
              height: CAMPUS_HEIGHT,
              backgroundImage: 'radial-gradient(circle, #86efac 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
            onMouseMove={(e) => {
              if (!designMode) return;
              const rect = e.currentTarget.getBoundingClientRect();
              // Calculate scale factor to correct cursor position since map is shrunk
              const scaleX = rect.width / CAMPUS_WIDTH; 
              const scaleY = rect.height / CAMPUS_HEIGHT;
              
              setCursor({ 
                x: Math.round((e.clientX - rect.left) / scaleX), 
                y: Math.round((e.clientY - rect.top) / scaleY) 
              });
            }}
          >
            {/* SVG Layer for Roads & Paths */}
            <svg className="absolute inset-0 pointer-events-none" width={CAMPUS_WIDTH} height={CAMPUS_HEIGHT}>
              {ROAD_SEGMENTS.map((segment, idx) => (
                <g key={`road-${idx}`}>
                  <line x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} stroke="#a8a29e" strokeWidth="40" strokeLinecap="round" />
                  <line x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} stroke="#fbbf24" strokeWidth="2" strokeDasharray="10 10" strokeLinecap="round" />
                </g>
              ))}
              
              {pathSegments.map((seg, idx) => (
                seg.type === 'walk' && (
                  <g key={`path-${idx}`}>
                    <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#2563eb" strokeWidth="6" strokeDasharray="12 8" className="animate-pulse" strokeLinecap="round" />
                    <circle cx={seg.x2} cy={seg.y2} r="8" fill="#2563eb" />
                  </g>
                )
              ))}

              {designMode && Object.values(OUTDOOR_NODES).map(node => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r="8" fill="red" stroke="white" strokeWidth="2" />
                </g>
              ))}
            </svg>

            {/* Render Buildings */}
            {BUILDINGS.map((building) => (
              <Building
                key={building.id}
                building={building}
                onClick={() => handleBuildingClick(building)}
                isHovered={hoveredBuilding === building.id}
                onMouseEnter={() => setHoveredBuilding(building.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
              />
            ))}

            {/* Design Mode Overlay */}
            {designMode && (
              <div className="absolute inset-0 pointer-events-none">
                <line x1={cursor.x} y1="0" x2={cursor.x} y2={CAMPUS_HEIGHT} stroke="red" strokeWidth="1" />
                <line x1="0" y1={cursor.y} x2={CAMPUS_WIDTH} y2={cursor.y} stroke="red" strokeWidth="1" />
                <div 
                  className="absolute bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg font-mono text-sm font-bold"
                  style={{ left: cursor.x + 15, top: cursor.y - 40 }}
                >
                  X: {cursor.x} | Y: {cursor.y}
                </div>
              </div>
            )}
          </div>
        </ResponsiveMapContainer>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FOOTER (Fixed Height)                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-3 text-center text-slate-600 text-xs border-t shrink-0">
        {designMode ? (
          <span className="font-bold text-amber-700">Design Mode Active</span>
        ) : (
          <span>
            🏛️ {BUILDINGS.filter(b => b.hasGraph).length} of {BUILDINGS.length} buildings available
            {pathSegments.length > 0 && <span className="ml-4 text-blue-600 font-bold">🚶 Following outdoor path...</span>}
          </span>
        )}
      </div>
    </div>
  );
};