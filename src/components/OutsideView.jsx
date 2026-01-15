/**
 * ═══════════════════════════════════════════════════════════════════
 * OUTSIDE VIEW - CAMPUS MAP WITH ROADS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/components/OutsideView.jsx
 * 
 * UPDATES:
 * ✅ Added road visualization from outdoorConfig
 * ✅ Added outdoor path rendering for cross-building navigation
 * ✅ Shows animated blue path when navigating between buildings
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { PenTool } from 'lucide-react';
import { Building } from './Building';
import { BUILDINGS, CAMPUS_WIDTH, CAMPUS_HEIGHT } from '../constants/buildingsConfig';
import { ROAD_SEGMENTS, OUTDOOR_NODES } from '../constants/outdoorConfig';
import { generatePathSegments } from '../utils/pathfinding';

export const OutsideView = ({ onEnterBuilding, outdoorPath, graph }) => {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [designMode, setDesignMode] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Generate outdoor path segments for visualization
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
          {/* Roads and Paths - SVG Layer */}
          <svg className="absolute inset-0 pointer-events-none" width={CAMPUS_WIDTH} height={CAMPUS_HEIGHT}>
            <defs>
              <pattern id="path-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#d4d4d4" />
                <rect x="0" y="0" width="10" height="10" fill="#e5e5e5" />
                <rect x="10" y="10" width="10" height="10" fill="#e5e5e5" />
              </pattern>
            </defs>
            
            {/* ══════════════════════════════════════════════════════ */}
            {/* CAMPUS ROADS - From outdoorConfig.js                  */}
            {/* ══════════════════════════════════════════════════════ */}
            {ROAD_SEGMENTS.map((segment, idx) => (
              <g key={`road-${idx}`}>
                {/* Road base (gray) */}
                <line
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  stroke="#a8a29e"
                  strokeWidth="40"
                  strokeLinecap="round"
                />
                {/* Road centerline (yellow dashed) */}
                <line
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  strokeLinecap="round"
                />
              </g>
            ))}
            
            {/* ══════════════════════════════════════════════════════ */}
            {/* OUTDOOR PATH VISUALIZATION (When navigating)           */}
            {/* ══════════════════════════════════════════════════════ */}
            {pathSegments.length > 0 && pathSegments.map((seg, idx) => {
              if (seg.type === 'walk') {
                return (
                  <g key={`path-${idx}`}>
                    {/* Animated path line (blue) */}
                    <line
                      x1={seg.x1}
                      y1={seg.y1}
                      x2={seg.x2}
                      y2={seg.y2}
                      stroke="#2563eb"
                      strokeWidth="6"
                      strokeDasharray="12 8"
                      className="animate-pulse"
                      strokeLinecap="round"
                    />
                    {/* Directional arrow at end */}
                    <circle cx={seg.x2} cy={seg.y2} r="8" fill="#2563eb" />
                  </g>
                );
              }
              return null;
            })}
            
            {/* ══════════════════════════════════════════════════════ */}
            {/* DESIGN MODE: Show outdoor nodes                       */}
            {/* ══════════════════════════════════════════════════════ */}
            {designMode && Object.values(OUTDOOR_NODES).map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill={node.type === 'entrance' ? '#10b981' : node.type === 'exit' ? '#ef4444' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <text
                  x={node.x}
                  y={node.y - 15}
                  textAnchor="middle"
                  className="text-xs font-bold fill-slate-700"
                  style={{ fontSize: '10px', pointerEvents: 'none' }}
                >
                  {node.id}
                </text>
              </g>
            ))}
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
                
                {/* Outdoor Nodes Info */}
                <div className="mt-4 pt-2 border-t border-amber-300">
                  <div className="font-bold text-amber-900 mb-2">Outdoor Nodes:</div>
                  {Object.values(OUTDOOR_NODES).slice(0, 5).map(node => (
                    <div key={node.id} className="text-amber-700 text-xs mb-1">
                      {node.id}: ({node.x}, {node.y})
                    </div>
                  ))}
                  <div className="text-amber-600 text-xs mt-1">
                    ... {Object.values(OUTDOOR_NODES).length} total nodes
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Design Mode Instructions */}
        {designMode && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-amber-100 border-2 border-amber-500 rounded-lg px-6 py-3 shadow-xl">
            <p className="text-amber-900 font-bold text-center">
              🎨 Design Mode Active: Hover to see coordinates. Outdoor nodes shown as colored dots.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-4 text-center text-slate-600 text-sm border-t">
        {designMode ? (
          <span className="font-bold text-amber-700">
            Design Mode: Roads and outdoor nodes visible. Check console for connection logs.
          </span>
        ) : (
          <span>
            🏛️ {BUILDINGS.filter(b => b.hasGraph).length} of {BUILDINGS.length} buildings available for navigation
            {pathSegments.length > 0 && (
              <span className="ml-4 text-blue-600 font-semibold">
                🚶 Following outdoor path...
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};