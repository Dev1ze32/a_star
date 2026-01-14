import React, { useState } from 'react';
import { OutsideView } from './components/OutsideView';
import { InsideView } from './components/InsideView';
import { NursingInsideView } from './components/NursingInsideView';
import { BCHInsideView } from './components/BCHInsideView'; // ✅ NEW IMPORT
import { useNavigation } from './hooks/useNavigation';
import { useNursingNavigation } from './hooks/useNursingNavigation';
import { useBCHNavigation } from './hooks/useBCHNavigation'; // ✅ NEW IMPORT

export default function App() {
  const [view, setView] = useState('outside');
  const [currentBuilding, setCurrentBuilding] = useState(null);
  
  const mainNavigation = useNavigation();
  const nursingNavigation = useNursingNavigation();
  const bchNavigation = useBCHNavigation(); // ✅ NEW HOOK

  const handleEnterBuilding = (buildingId) => {
    setCurrentBuilding(buildingId);
    setView('inside');
  };

  const handleExitBuilding = () => {
    setView('outside');
    setCurrentBuilding(null);
  };

  const renderInsideView = () => {
    switch (currentBuilding) {
      case 'main':
        return (
          <InsideView 
            {...mainNavigation}
            buildingId={currentBuilding}
            onExit={handleExitBuilding}
          />
        );
      
      case 'nursing':
        return (
          <NursingInsideView 
            {...nursingNavigation}
            onExit={handleExitBuilding}
          />
        );
      
      // ✅ NEW BCH BUILDING CASE
      case 'bch':
        return (
          <BCHInsideView 
            {...bchNavigation}
            onExit={handleExitBuilding}
          />
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
                Exit Building
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen font-sans text-slate-900 bg-slate-50">
      {view === 'outside' ? (
        <OutsideView onEnterBuilding={handleEnterBuilding} />
      ) : (
        renderInsideView()
      )}
    </div>
  );
}