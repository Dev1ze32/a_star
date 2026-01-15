import React, { useState } from 'react';
import { OutsideView } from './components/OutsideView';
import { InsideView } from './components/InsideView';
import { NursingInsideView } from './components/NursingInsideView';
import { BCHInsideView } from './components/BCHInsideView'; // ✅ ADDED THIS IMPORT
import { UnifiedNavigationControls } from './components/UnifiedNavigationControls';
import { useUnifiedNavigation } from './hooks/useUnifiedNavigation';
import { Search } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('outside');
  const [designMode, setDesignMode] = useState(false);
  
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

  const handleEnterBuilding = (buildingId) => {
    setActiveBuilding(buildingId);
    setView('inside');
  };

  const handleExitBuilding = () => {
    setView('outside');
    setActiveBuilding('outdoor');
  };

  const handleCalculatePath = () => {
    calculatePath();
    if (isCrossBuildingPath()) {
      setView('outside');
      setActiveBuilding('outdoor');
    } else {
      setView('inside');
    }
  };

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
      case 'main': return <InsideView {...commonProps} buildingId="main" />;
      case 'nursing': return <NursingInsideView {...commonProps} />;
      case 'bch': return <BCHInsideView {...commonProps} />; // ✅ UPDATED TO USE BCHInsideView
      default: return null;
    }
  };

  return (
    <div className="w-full h-screen font-sans text-slate-900 bg-slate-50 flex overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════ */}
      {/* LEFT SIDEBAR - NAVIGATION & SEARCH                     */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="w-80 bg-white shadow-xl z-20 flex flex-col border-r border-slate-200">
        
        <div className="p-5 border-b border-slate-100 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Campus Nav</h1>
          <p className="text-blue-100 text-xs mt-1">University Map System</p>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search room..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
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
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
          {path.length > 0 ? (
             <div className="flex flex-col gap-2">
                <span className="font-bold text-blue-600">✅ Path Found ({path.length} steps)</span>
                <button onClick={clearPath} className="text-red-500 hover:underline">Clear Navigation</button>
             </div>
          ) : (
            "Select start & end to navigate"
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* RIGHT CONTENT - MAP AREA                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden flex items-center justify-center">
        <div className="transform scale-90 origin-center w-full h-full flex items-center justify-center">
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
      </div>
      
    </div>
  );
}