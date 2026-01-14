import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { BCHFloorMap } from './BCHFloorMap';

/**
 * ═══════════════════════════════════════════════════════════════════
 * BCH INSIDE VIEW COMPONENT
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This is the main component that displays when you enter the BCH building.
 * 
 * FEATURES:
 * - Header with building name
 * - Navigation controls (start/end selection, floor buttons)
 * - Floor map visualization
 * - Design mode toggle
 * - Status footer
 * 
 * TO CUSTOMIZE APPEARANCE:
 * - Change header colors in bg-gradient-to-r
 * - Modify layout padding/spacing
 * - Adjust floor button colors
 * ═══════════════════════════════════════════════════════════════════
 */

export const BCHInsideView = ({ 
  graph, 
  rooms, 
  startNode, 
  setStartNode, 
  endNode, 
  setEndNode, 
  path, 
  activeFloor, 
  setActiveFloor, 
  calculatePath,
  onExit 
}) => {
  const [designMode, setDesignMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-blue-50">
      {/* ══════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 shadow-md">
        <h2 className="text-2xl font-bold text-center">
          🏥 BCH Building - Interior Map
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* NAVIGATION CONTROLS */}
      {/* ══════════════════════════════════════════════════════ */}
      <NavigationControls
        onExit={onExit}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}
        rooms={rooms}
        onCalculatePath={calculatePath}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        designMode={designMode}
        setDesignMode={setDesignMode}
        maxFloors={4} // ✅ BCH has 5 floors (0-4)
      />

      {/* ══════════════════════════════════════════════════════ */}
      {/* FLOOR MAP DISPLAY */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-auto relative bg-blue-50 flex items-center justify-center p-8">
        <BCHFloorMap
          graph={graph}
          activeFloor={activeFloor}
          path={path}
          startNode={startNode}
          endNode={endNode}
          onNodeClick={setEndNode}
          designMode={designMode}
        />
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STATUS FOOTER */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-t p-4 text-center text-slate-500 text-sm">
        {designMode ? (
          <span className="font-bold text-amber-600">
            🎨 DESIGN MODE ACTIVE: Use X/Y coordinates to adjust positions in bchBuildingConfig.js!
          </span>
        ) : (
          path.length > 0 ? (
            <span className="font-semibold text-blue-600">
              ✅ Navigation Active: Follow the dotted blue line.
            </span>
          ) : (
            "Select a Start Point and Destination, then click 'Find Path'."
          )
        )}
      </div>
    </div>
  );
};