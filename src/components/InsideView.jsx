import React, { useState } from 'react';
import { NavigationControls } from './NavigationControls';
import { FloorMap } from './FloorMap';
// ✅ FIXED: Split the imports into the correct files
import { BUILDINGS } from '../constants/buildingsConfig'; // Plural (contains the list of buildings)
import { BUILDING_WIDTH, BUILDING_HEIGHT } from '../constants/buildingConfig'; // Singular (contains Main Building dimensions)
import { ResponsiveMapContainer } from './ResponsiveMapContainer';

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 shadow-md shrink-0">
        <h2 className="text-xl font-bold text-center">
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
        maxFloors={3}
      />

      <div className="flex-1 overflow-hidden relative bg-slate-100">
        <ResponsiveMapContainer originalWidth={BUILDING_WIDTH} originalHeight={BUILDING_HEIGHT}>
          <FloorMap
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