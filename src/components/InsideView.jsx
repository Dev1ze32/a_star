import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { FloorMap } from './FloorMap';
import { BUILDINGS } from '../constants/buildingsConfig';

export const InsideView = ({ 
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
  buildingId,
  onExit 
}) => {
  const [designMode, setDesignMode] = useState(false);
  
  const currentBuilding = BUILDINGS.find(b => b.id === buildingId);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Building Name Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {currentBuilding?.name || 'Building'} - Interior Map
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
      />

      <div className="flex-1 overflow-auto relative bg-slate-50 flex items-center justify-center p-8">
        <FloorMap
          graph={graph}
          activeFloor={activeFloor}
          path={path}
          startNode={startNode}
          endNode={endNode}
          onNodeClick={setEndNode}
          designMode={designMode}
          buildingId={buildingId}
        />
      </div>

      <div className="bg-white border-t p-4 text-center text-slate-500 text-sm">
        {designMode ? (
          <span className="font-bold text-amber-600">
            DESIGN MODE ACTIVE: Use the X/Y coordinates to update the 'nodes' in the code!
          </span>
        ) : (
          path.length > 0 ? (
            <span className="font-semibold text-blue-600">Navigation Active: Follow the dotted line.</span>
          ) : "Select a Start Point and Destination."
        )}
      </div>
    </div>
  );
};