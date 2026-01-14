import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { FloorMap } from './FloorMap';

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
  onExit 
}) => {
  const [designMode, setDesignMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50">
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