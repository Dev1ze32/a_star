import React from 'react';

export const OutsideView = ({ onEnter }) => (
  <div className="flex flex-col items-center justify-center h-full bg-sky-100 p-8 animate-fade-in">
    <h1 className="text-4xl font-bold text-slate-800 mb-8">University Building Map</h1>
    
    <div 
      onClick={onEnter}
      className="relative group cursor-pointer transition-transform transform hover:scale-105"
    >
      <div className="w-96 h-80 bg-slate-200 border-4 border-slate-700 rounded-t-xl relative flex flex-col justify-end overflow-hidden shadow-2xl">
        <div className="flex flex-wrap justify-around p-4 gap-4 h-full content-start mt-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-16 h-12 bg-sky-300 border-2 border-slate-500 shadow-inner group-hover:bg-yellow-100 transition-colors"></div>
          ))}
        </div>
        <div className="self-center w-24 h-20 bg-slate-600 rounded-t-lg border-x-4 border-t-4 border-slate-800 relative group-hover:bg-slate-500">
          <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
        <div className="absolute -top-12 left-0 w-full text-center">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold animate-bounce">
            Click to Enter
          </span>
        </div>
      </div>
      <div className="w-[500px] h-8 bg-green-600 -ml-14 rounded-full mt-[-4px] z-[-1]"></div>
    </div>
  </div>
);