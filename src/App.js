/**
 * ═══════════════════════════════════════════════════════════════════
 * CAMPUS NAVIGATION APP - UNIFIED SYSTEM
 * ═══════════════════════════════════════════════════════════════════
 * 
 * FILE LOCATION: src/App.js
 * 
 * Main application component with support for:
 * - Campus-wide navigation (Main ↔ Nursing building pathfinding)
 * - Outdoor path visualization
 * - Building interior views
 * - Seamless transitions between indoor/outdoor views
 * 
 * VIEWS:
 * - 'outside': Campus map with buildings and outdoor paths
 * - 'inside': Building interior with floor maps
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { OutsideView } from './components/OutsideView';
import { InsideView } from './components/InsideView';
import { NursingInsideView } from './components/NursingInsideView';
import { UnifiedNavigationControls } from './components/UnifiedNavigationControls';
import { useUnifiedNavigation } from './hooks/useUnifiedNavigation';

export default function App() {
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ VIEW STATE                                                       │
  // └─────────────────────────────────────────────────────────────────┘
  
  const [view, setView] = useState('outside'); // 'outside' or 'inside'
  const [designMode, setDesignMode] = useState(false);
  
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ UNIFIED NAVIGATION (Campus-wide pathfinding)                     │
  // └─────────────────────────────────────────────────────────────────┘
  
  const {
    graph,
    roomsByBuilding,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    path,
    activeFloor,
    setActiveFloor,
    activeBuilding,
    setActiveBuilding,
    calculatePath,
    clearPath,
    getOutdoorPath,
    isCrossBuildingPath
  } = useUnifiedNavigation();

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ VIEW NAVIGATION HANDLERS                                         │
  // └─────────────────────────────────────────────────────────────────┘

  /**
   * Enter a building (switch to inside view)
   */
  const handleEnterBuilding = (buildingId) => {
    setActiveBuilding(buildingId);
    setView('inside');
  };

  /**
   * Exit building (return to campus view)
   */
  const handleExitBuilding = () => {
    setView('outside');
    setActiveBuilding('outdoor');
  };

  /**
   * Calculate path and switch to appropriate view
   */
  const handleCalculatePath = () => {
    calculatePath();
    
    // If path crosses buildings, show outdoor view first
    // Otherwise show the starting building's interior
    if (isCrossBuildingPath()) {
      setView('outside');
      setActiveBuilding('outdoor');
    } else {
      setView('inside');
    }
  };

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ RENDER BUILDING INTERIOR VIEWS                                   │
  // └─────────────────────────────────────────────────────────────────┘

  const renderInsideView = () => {
    const commonProps = {
      graph,
      rooms: roomsByBuilding[activeBuilding] || [],
      startNode,
      setStartNode,
      endNode,
      setEndNode,
      path,
      activeFloor,
      setActiveFloor,
      calculatePath: handleCalculatePath,
      onExit: handleExitBuilding
    };

    switch (activeBuilding) {
      case 'main':
        return <InsideView {...commonProps} buildingId="main" />;
      
      case 'nursing':
        return <NursingInsideView {...commonProps} />;
      
      case 'bch':
        // BCH is coming soon for building-to-building nav
        return (
          <div className="flex items-center justify-center h-full bg-slate-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">
                🚧 BCH Building - Coming Soon
              </h2>
              <p className="text-slate-600 mb-6">
                Building-to-building navigation for BCH will be available soon!
              </p>
              <button 
                onClick={handleExitBuilding}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
              >
                Return to Campus
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-slate-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-700 mb-4">Building Under Construction</h2>
              <button 
                onClick={handleExitBuilding}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
              >
                Return to Campus
              </button>
            </div>
          </div>
        );
    }
  };

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ MAIN RENDER                                                      │
  // └─────────────────────────────────────────────────────────────────┘

  return (
    <div className="w-full h-screen font-sans text-slate-900 bg-slate-50 flex flex-col">
      
      {/* ══════════════════════════════════════════════════════ */}
      {/* NAVIGATION CONTROLS (Always visible)                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <UnifiedNavigationControls
        onExit={handleExitBuilding}
        startNode={startNode}
        setStartNode={setStartNode}
        endNode={endNode}
        setEndNode={setEndNode}
        roomsByBuilding={roomsByBuilding}
        onCalculatePath={handleCalculatePath}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        activeBuilding={activeBuilding}
        setActiveBuilding={setActiveBuilding}
        designMode={designMode}
        setDesignMode={setDesignMode}
        isCrossBuildingPath={isCrossBuildingPath()}
        graph={graph}
      />

      {/* ══════════════════════════════════════════════════════ */}
      {/* VIEW CONTENT (Campus or Building Interior)            */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden">
        {view === 'outside' || activeBuilding === 'outdoor' ? (
          <OutsideView 
            onEnterBuilding={handleEnterBuilding}
            outdoorPath={getOutdoorPath()}
            graph={graph}
          />
        ) : (
          renderInsideView()
        )}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STATUS FOOTER                                          */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-t p-3 text-center text-sm">
        {designMode ? (
          <span className="font-bold text-amber-600">
            🎨 DESIGN MODE: Use coordinates to adjust node positions
          </span>
        ) : path.length > 0 ? (
          <div className="flex items-center justify-center space-x-4">
            <span className="font-semibold text-blue-600">
              ✅ Navigation Active: {path.length} steps
            </span>
            {isCrossBuildingPath() && (
              <span className="px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-xs font-bold text-amber-700">
                🚶 Multi-Building Route
              </span>
            )}
            <button
              onClick={clearPath}
              className="px-4 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-xs"
            >
              Clear Path
            </button>
          </div>
        ) : (
          <span className="text-slate-500">
            Select start location and destination, then click "Find Path"
          </span>
        )}
      </div>
    </div>
  );
}