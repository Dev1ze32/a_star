/**
 * ═══════════════════════════════════════════════════════════════════
 * UNIFIED NAVIGATION CONTROLS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/components/UnifiedNavigationControls.jsx
 * 
 * Enhanced navigation controls with:
 * - Building selection dropdown
 * - Floor selection (context-aware based on selected building)
 * - Room/location selection organized by building
 * - Cross-building path indicator
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { ArrowLeft, Navigation, PenTool, Building2, MapPin } from 'lucide-react';

export const UnifiedNavigationControls = ({
  onExit,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  roomsByBuilding,
  onCalculatePath,
  activeFloor,
  setActiveFloor,
  activeBuilding,
  setActiveBuilding,
  designMode,
  setDesignMode,
  isCrossBuildingPath,
  graph
}) => {
  // Track which building is selected for start/end dropdowns
  const [startBuilding, setStartBuilding] = useState('main');
  const [endBuilding, setEndBuilding] = useState('main');

  // Get max floors for current building
  const getMaxFloors = (building) => {
    switch(building) {
      case 'main': return 3;      // Main: G, 1, 2, 3 (0-3)
      case 'nursing': return 3;   // Nursing: 1, 2, 3, 4 (0-3 in code)
      case 'bch': return 4;       // BCH: G, 1, 2, 3, 4 (0-4)
      default: return 0;
    }
  };

  // Generate floor buttons for active building
  const floorButtons = [];
  const maxFloors = getMaxFloors(activeBuilding);
  for (let f = 0; f <= maxFloors; f++) {
    floorButtons.push(f);
  }

  return (
    <div className="bg-white p-4 shadow-md z-10">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* ══════════════════════════════════════════════════════ */}
        {/* TOP ROW: Exit Button + Building Selector              */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onExit}
            className="flex items-center text-slate-600 hover:text-blue-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Exit to Campus
          </button>

          {/* Building Selector */}
          <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
            <Building2 className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Viewing:</span>
            <select
              value={activeBuilding}
              onChange={(e) => setActiveBuilding(e.target.value)}
              className="px-3 py-1 rounded border border-slate-300 text-sm font-semibold bg-white"
            >
              <option value="main">Main Building</option>
              <option value="nursing">Nursing Building</option>
              <option value="outdoor">Campus Map</option>
            </select>
          </div>

          {/* Design Mode Toggle */}
          <button 
            onClick={() => setDesignMode(!designMode)}
            className={`p-2 rounded border transition-all ${
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
        {/* MIDDLE ROW: Start/End Selection + Find Path Button    */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          
          {/* Start Location Selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              <MapPin className="w-3 h-3 inline mr-1" />
              Start Location
            </label>
            <div className="flex space-x-2">
              {/* Building selector for start */}
              <select
                value={startBuilding}
                onChange={(e) => {
                  setStartBuilding(e.target.value);
                  setStartNode(''); // Clear selection when building changes
                }}
                className="px-3 py-2 rounded border border-slate-300 text-sm bg-white font-medium"
              >
                <option value="main">Main Bldg</option>
                <option value="nursing">Nursing</option>
              </select>
              
              {/* Room selector for start */}
              <select 
                className="px-3 py-2 rounded border border-slate-300 text-sm min-w-[200px] bg-white"
                value={startNode} 
                onChange={(e) => setStartNode(e.target.value)}
              >
                <option value="">Select Start...</option>
                {roomsByBuilding[startBuilding]?.map(room => {
                  const floorLabel = room.floor === 0 ? 'G' : room.floor;
                  return (
                    <option key={room.id} value={room.id}>
                      {room.label || room.id} (F{floorLabel})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="text-blue-400 self-end pb-2">
            <Navigation className="w-6 h-6"/>
          </div>

          {/* End Location Selection */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              <MapPin className="w-3 h-3 inline mr-1" />
              Destination
            </label>
            <div className="flex space-x-2">
              {/* Building selector for end */}
              <select
                value={endBuilding}
                onChange={(e) => {
                  setEndBuilding(e.target.value);
                  setEndNode(''); // Clear selection when building changes
                }}
                className="px-3 py-2 rounded border border-slate-300 text-sm bg-white font-medium"
              >
                <option value="main">Main Bldg</option>
                <option value="nursing">Nursing</option>
              </select>
              
              {/* Room selector for end */}
              <select 
                className="px-3 py-2 rounded border border-slate-300 text-sm min-w-[200px] bg-white"
                value={endNode} 
                onChange={(e) => setEndNode(e.target.value)}
              >
                <option value="">Select Destination...</option>
                {roomsByBuilding[endBuilding]?.map(room => {
                  const floorLabel = room.floor === 0 ? 'G' : room.floor;
                  return (
                    <option key={room.id} value={room.id}>
                      {room.label || room.id} (F{floorLabel})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Find Path Button */}
          <button 
            onClick={onCalculatePath}
            disabled={!startNode || !endNode}
            className={`self-end px-6 py-2 rounded-lg font-bold shadow-md transition-all ${
              startNode && endNode
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Find Path
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* BOTTOM ROW: Floor Navigation (only for buildings)     */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeBuilding !== 'outdoor' && (
          <div className="flex items-center justify-center space-x-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Floor:</span>
            
            {floorButtons.map(f => {
              const label = f === 0 ? 'G' : f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFloor(f)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    activeFloor === f 
                      ? 'bg-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200' 
                      : 'bg-white text-slate-600 border-2 border-slate-300 hover:bg-slate-100 hover:border-blue-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {/* Cross-building indicator */}
            {isCrossBuildingPath && (
              <div className="ml-4 px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-xs font-bold text-amber-700">
                🚶 Multi-Building Route
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};