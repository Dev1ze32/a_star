import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Building, GraduationCap } from 'lucide-react';
import { BUILDINGS } from '../constants/buildingsConfig';
import { FindProfessorModal } from './FindProfessorModal'; // ✅ Import Modal

export const UnifiedNavigationControls = ({
  onExit,
  endNode,
  setEndNode,
  roomsByBuilding,
  onCalculatePath,
  activeFloor,
  setActiveFloor,
  activeBuilding,
  designMode,
  setDesignMode
}) => {
  const [endBuildId, setEndBuildId] = useState('main');
  
  // ✅ State for Modal
  const [showProfModal, setShowProfModal] = useState(false);

  const getRooms = (buildId) => roomsByBuilding[buildId] || [];

  // Determine floors: BCH=5 (0-4), others=4 (0-3)
  const maxFloorIndex = activeBuilding === 'bch' ? 4 : 3;
  const floorButtons = Array.from({ length: maxFloorIndex + 1 }, (_, i) => i);

  return (
    <>
      <div className="flex flex-col gap-6 p-2">
        
        {/* Return Button */}
        {activeBuilding !== 'outdoor' && (
          <button 
            onClick={onExit}
            className="flex items-center justify-center w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Campus View
          </button>
        )}

        <div className="flex flex-col gap-4">
          
          {/* Static Start Location */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <div>
                  <div className="text-xs text-blue-400 font-bold uppercase">Starting From</div>
                  <div className="text-sm font-bold text-blue-900">Main Building Kiosk</div>
              </div>
          </div>

          <div className="flex justify-center -my-2">
             <div className="h-4 w-0.5 bg-slate-300"></div>
          </div>

          {/* Destination Selection */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</label>
            </div>

            <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <div className="relative">
                <Building className="absolute left-2 top-2.5 w-3 h-3 text-slate-400" />
                <select 
                  value={endBuildId} 
                  onChange={(e) => setEndBuildId(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-sm bg-white border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-3 h-3 text-slate-400" />
                <select 
                  value={endNode} 
                  onChange={(e) => setEndNode(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-sm bg-white border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Destination...</option>
                  {getRooms(endBuildId).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label || r.id} {r.floor !== undefined ? `(F${r.floor === 0 ? 'G' : r.floor})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={onCalculatePath}
              disabled={!endNode}
              className={`w-full py-3 rounded-lg font-bold shadow-sm flex items-center justify-center transition-all ${
                endNode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Find Path
            </button>

            {/* ✅ NEW: Find My Professor Button */}
            <button
              onClick={() => setShowProfModal(true)}
              className="w-full py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-lg font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
            >
              <GraduationCap className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              Find My Professor
            </button>
          </div>
        </div>

        {/* Floor Controls */}
        {activeBuilding !== 'outdoor' && (
          <div className="mt-2 pt-4 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block text-center">
              Current Floor
            </label>
            <div className="flex justify-center gap-2">
              {floorButtons.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFloor(f)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all border ${
                    activeFloor === f
                      ? 'bg-slate-800 text-white border-slate-800 shadow-lg scale-110'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {f === 0 ? 'G' : f}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 text-center">
          <button 
            onClick={() => setDesignMode(!designMode)}
            className="text-xs px-3 py-1 rounded-full border text-slate-400"
          >
            {designMode ? 'Disable Design Mode' : 'Enable Design Mode'}
          </button>
        </div>
      </div>

      {/* ✅ RENDER MODAL OUTSIDE THE FLOW */}
      <FindProfessorModal 
        isOpen={showProfModal} 
        onClose={() => setShowProfModal(false)} 
      />
    </>
  );
};