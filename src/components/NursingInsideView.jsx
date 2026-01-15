import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { NursingFloorMap } from './NursingFloorMap';

export const NursingInsideView = ({ 
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
    <div className="flex flex-col h-full bg-emerald-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 shadow-md">
        <h2 className="text-2xl font-bold text-center">
          🏥 Nursing Building - Interior Map
        </h2>
      </div>

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
        maxFloors={3} // ✅ FIXED: Nursing Building has 4 floors (0-3)
      />

      <div className="flex-1 overflow-auto relative bg-emerald-50 flex items-center justify-center p-8">
        <NursingFloorMap
          graph={graph}
          activeFloor={activeFloor}
          path={path}
          startNode={startNode}
          endNode={endNode}
          onNodeClick={setEndNode}
          designMode={designMode}
        />
      </div>

      <div className="bg-white border-t p-4 text-center text-slate-500 text-sm">
        {designMode ? (
          <span className="font-bold text-amber-600">
            DESIGN MODE ACTIVE: Use X/Y coordinates to adjust room positions!
          </span>
        ) : (
          path.length > 0 ? (
            <span className="font-semibold text-green-600">Navigation Active: Follow the dotted line.</span>
          ) : "Select Destination to find your path."
        )}
      </div>
    </div>
  );
};