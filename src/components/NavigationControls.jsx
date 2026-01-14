import React from 'react';
import { ArrowLeft, Navigation, PenTool } from 'lucide-react';

export const NavigationControls = ({
  onExit,
  startNode,
  setStartNode,
  endNode,
  setEndNode,
  rooms,
  onCalculatePath,
  activeFloor,
  setActiveFloor,
  designMode,
  setDesignMode,
  maxFloors = 4 // ✅ NEW: Support dynamic floor count (default 4 for Main/Nursing)
}) => {
  // ✅ Generate floor buttons dynamically based on maxFloors
  const floorButtons = [];
  for (let f = 0; f <= maxFloors; f++) {
    floorButtons.push(f);
  }

  return (
    <div className="bg-white p-4 shadow-md z-10">
      <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto">
        <button 
          onClick={onExit}
          className="flex items-center text-slate-600 hover:text-blue-600 font-semibold mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Exit
        </button>

        <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              className="p-2 rounded border border-slate-300 text-sm"
              value={startNode} 
              onChange={(e) => setStartNode(e.target.value)}
            >
              <option value="">Start Location</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.id} (F{r.floor === 0 ? 'G' : r.floor})</option>)}
            </select>
            <div className="text-slate-400 self-center">
              <Navigation className="w-4 h-4"/>
            </div>
            <select 
              className="p-2 rounded border border-slate-300 text-sm"
              value={endNode} 
              onChange={(e) => setEndNode(e.target.value)}
            >
              <option value="">Destination</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.id} (F{r.floor === 0 ? 'G' : r.floor})</option>)}
            </select>
          </div>
          <button 
            onClick={onCalculatePath}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold shadow-sm"
          >
            Find Path
          </button>
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-slate-500 font-medium mr-2">Floor:</span>
          {/* ✅ DYNAMIC FLOOR BUTTONS */}
          {floorButtons.map(f => (
            <button
              key={f}
              onClick={() => setActiveFloor(f)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                activeFloor === f 
                  ? 'bg-blue-600 text-white shadow-lg scale-110' 
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {f === 0 ? 'G' : f}
            </button>
          ))}
          
          <button 
            onClick={() => setDesignMode(!designMode)}
            className={`ml-4 p-2 rounded border ${designMode ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-slate-300 text-slate-400'}`}
            title="Toggle Design Mode"
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};