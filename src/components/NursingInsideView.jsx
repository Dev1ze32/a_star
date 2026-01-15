import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { NursingFloorMap } from './NursingFloorMap';
import { NURSING_BUILDING_WIDTH, NURSING_BUILDING_HEIGHT } from '../constants/nursingBuildingConfig';
import { ResponsiveMapContainer } from './ResponsiveMapContainer'; // ✅ IMPORT

export const NursingInsideView = ({ 
  graph, rooms, startNode, setStartNode, endNode, setEndNode, 
  path, activeFloor, setActiveFloor, calculatePath, onExit 
}) => {
  const [designMode, setDesignMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-emerald-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-6 py-3 shadow-md shrink-0">
        <h2 className="text-xl font-bold text-center">🏥 Nursing Building</h2>
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
        maxFloors={3}
      />

      {/* ✅ WRAPPED MAP */}
      <div className="flex-1 overflow-hidden relative bg-emerald-50">
        <ResponsiveMapContainer originalWidth={NURSING_BUILDING_WIDTH} originalHeight={NURSING_BUILDING_HEIGHT}>
          <NursingFloorMap
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