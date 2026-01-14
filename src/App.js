import React, { useState } from 'react';
import { OutsideView } from './components/OutsideView';
import { InsideView } from './components/InsideView';
import { useNavigation } from './hooks/useNavigation';

export default function App() {
  const [view, setView] = useState('outside');
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const navigation = useNavigation();

  const handleEnterBuilding = (buildingId) => {
    setCurrentBuilding(buildingId);
    setView('inside');
  };

  const handleExitBuilding = () => {
    setView('outside');
    setCurrentBuilding(null);
  };

  return (
    <div className="w-full h-screen font-sans text-slate-900 bg-slate-50">
      {view === 'outside' ? (
        <OutsideView onEnterBuilding={handleEnterBuilding} />
      ) : (
        <InsideView 
          {...navigation}
          buildingId={currentBuilding}
          onExit={handleExitBuilding}
        />
      )}
    </div>
  );
}