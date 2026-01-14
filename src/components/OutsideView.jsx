import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import { Building } from './Building';
import { BUILDINGS, CAMPUS_WIDTH, CAMPUS_HEIGHT } from '../constants/buildingsConfig';

export const OutsideView = ({ onEnterBuilding }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [designMode, setDesignMode] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handleBuildingClick = (building) => {
    if (building.hasGraph) {
      onEnterBuilding(building.id);
    } else {
      alert(`${building.name} is under construction. Coming soon!`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-200 to-sky-100 relative overflow-hidden">
      {/* Header */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 shadow-lg z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">University Campus Map</h1>
            <p className="text-slate-600 mt-2">Click on any building to explore</p>
          </div>
          
          {/* Design Mode Toggle */}
          <button 
            onClick={() => setDesignMode(!designMode)}
            className={`p-3 rounded-lg border-2 transition-all ${
              designMode 
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-lg' 
                : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
            }`}
            title="Toggle Design Mode - Shows X/Y coordinates"
          >
            <PenTool className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Campus View */}
      <div 
        className="flex-1 flex items-center justify-center p-8 relative"
        onMouseMove={(e) => {
          if (!designMode) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setCursor({ 
            x: Math.round(e.clientX - rect.left), 
            y: Math.round(e.clientY - rect.top) 
          });
        }}
      >
        {/* Campus Container */}
        <div 
          className="relative bg-green-200 rounded-3xl shadow-2xl border-4 border-green-700 overflow-hidden"
          style={{ 
            width: `${CAMPUS_WIDTH}px`, 
            height: `${CAMPUS_HEIGHT}px`,
            backgroundImage: 'radial-gradient(circle, #86efac 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        >
          {/* Decorative Paths */}
          <svg className="absolute inset-0 pointer-events-none" width={CAMPUS_WIDTH} height={CAMPUS_HEIGHT}>
            <defs>
              <pattern id="path-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#d4d4d4" />
                <rect x="0" y="0" width="10" height="10" fill="#e5e5e5" />
                <rect x="10" y="10" width="10" height="10" fill="#e5e5e5" />
              </pattern>
            </defs>
            {/* Horizontal Path */}
            <rect x="0" y={CAMPUS_HEIGHT / 2 - 30} width={CAMPUS_WIDTH} height="60" fill="url(#path-pattern)" opacity="0.8" />
            {/* Vertical Path */}
            <rect x={CAMPUS_WIDTH / 2 - 30} y="0" width="60" height={CAMPUS_HEIGHT} fill="url(#path-pattern)" opacity="0.8" />
          </svg>

          {/* Buildings */}
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
              {/* Grid Lines */}
              <svg width={CAMPUS_WIDTH} height={CAMPUS_HEIGHT}>
                {/* Vertical Lines */}
                {[...Array(Math.floor(CAMPUS_WIDTH / 50))].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 50}
                    y1="0"
                    x2={i * 50}
                    y2={CAMPUS_HEIGHT}
                    stroke="red"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    opacity="0.3"
                  />
                ))}
                {/* Horizontal Lines */}
                {[...Array(Math.floor(CAMPUS_HEIGHT / 50))].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 50}
                    x2={CAMPUS_WIDTH}
                    y2={i * 50}
                    stroke="red"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    opacity="0.3"
                  />
                ))}

                {/* Crosshair */}
                <line x1={cursor.x} y1="0" x2={cursor.x} y2={CAMPUS_HEIGHT} stroke="red" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1={cursor.y} x2={CAMPUS_WIDTH} y2={cursor.y} stroke="red" strokeWidth="1" opacity="0.6" />
                <circle cx={cursor.x} cy={cursor.y} r="8" fill="none" stroke="red" strokeWidth="2" />
              </svg>

              {/* Coordinate Display */}
              <div 
                className="absolute bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg font-mono text-sm font-bold pointer-events-none"
                style={{
                  left: `${Math.min(cursor.x + 15, CAMPUS_WIDTH - 120)}px`,
                  top: `${Math.max(cursor.y - 40, 10)}px`
                }}
              >
                X: {cursor.x} | Y: {cursor.y}
              </div>

              {/* Building Positions Info */}
              <div className="absolute top-4 right-4 bg-amber-50 border-2 border-amber-500 rounded-lg p-4 text-xs font-mono max-h-96 overflow-y-auto">
                <div className="font-bold text-amber-900 mb-2">Building Positions:</div>
                {BUILDINGS.map(b => (
                  <div key={b.id} className="mb-2 pb-2 border-b border-amber-200 last:border-0">
                    <div className="font-semibold text-amber-800">{b.name}</div>
                    <div className="text-amber-700">
                      x: {b.x}, y: {b.y}
                      <br />
                      w: {b.width}, h: {b.height}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Design Mode Instructions */}
        {designMode && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-amber-100 border-2 border-amber-500 rounded-lg px-6 py-3 shadow-xl">
            <p className="text-amber-900 font-bold text-center">
              🎨 Design Mode Active: Hover to see coordinates. Update positions in buildingsConfig.js
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-4 text-center text-slate-600 text-sm border-t">
        {designMode ? (
          <span className="font-bold text-amber-700">
            Design Mode: Use coordinates to position buildings in src/constants/buildingsConfig.js
          </span>
        ) : (
          <span>
            🏛️ {BUILDINGS.filter(b => b.hasGraph).length} of {BUILDINGS.length} buildings available for navigation
          </span>
        )}
      </div>
    </div>
  );
};