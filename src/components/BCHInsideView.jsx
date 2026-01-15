import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { BCHFloorMap } from './BCHFloorMap';
import { BCH_BUILDING_WIDTH, BCH_BUILDING_HEIGHT } from '../constants/bchBuildingConfig';
import { ResponsiveMapContainer } from './ResponsiveMapContainer'; // ✅ IMPORT

export const BCHInsideView = ({ 
  graph, rooms, startNode, setStartNode, endNode, setEndNode, 
  path, activeFloor, setActiveFloor, calculatePath, onExit 
}) => {
  const [designMode, setDesignMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-blue-50">
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-6 py-3 shadow-md shrink-0">
        <h2 className="text-xl font-bold text-center">🏢 BCH Building</h2>
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
        maxFloors={4}
      />

      {/* ✅ WRAPPED MAP */}
      <div className="flex-1 overflow-hidden relative bg-blue-50">
        <ResponsiveMapContainer originalWidth={BCH_BUILDING_WIDTH} originalHeight={BCH_BUILDING_HEIGHT}>
          <BCHFloorMap
            graph={graph}
            activeFloor={activeFloor}
            path={path}
            startNode={startNode}
            endNode={endNode}
            onNodeClick={setEndNode}
            designMode={designMode}
          />
        </ResponsiveMapContainer>
      </div>
    </div>
  );
};