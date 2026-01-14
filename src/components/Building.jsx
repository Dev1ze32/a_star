import React from 'react';

export const Building = ({ 
  building, 
  onClick, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const colorSchemes = {
    slate: {
      base: 'bg-slate-200',
      border: 'border-slate-700',
      window: 'bg-sky-300',
      windowHover: 'group-hover:bg-yellow-100',
      door: 'bg-slate-600',
      doorHover: 'group-hover:bg-slate-500'
    },
    blue: {
      base: 'bg-blue-100',
      border: 'border-blue-800',
      window: 'bg-blue-400',
      windowHover: 'group-hover:bg-yellow-100',
      door: 'bg-blue-700',
      doorHover: 'group-hover:bg-blue-600'
    },
    green: {
      base: 'bg-green-100',
      border: 'border-green-800',
      window: 'bg-green-400',
      windowHover: 'group-hover:bg-yellow-100',
      door: 'bg-green-700',
      doorHover: 'group-hover:bg-green-600'
    }
  };

  const colors = colorSchemes[building.color] || colorSchemes.slate;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute group cursor-pointer transition-transform transform hover:scale-105"
      style={{
        left: `${building.x}px`,
        top: `${building.y}px`,
        width: `${building.width}px`,
        height: `${building.height}px`
      }}
    >
      {/* Building Structure */}
      <div className={`w-full h-full ${colors.base} border-4 ${colors.border} rounded-t-xl relative flex flex-col justify-end overflow-hidden shadow-2xl`}>
        {/* Windows */}
        <div className="flex flex-wrap justify-around p-4 gap-3 h-full content-start mt-4">
          {[...Array(building.windows)].map((_, i) => (
            <div 
              key={i} 
              className={`w-12 h-10 ${colors.window} border-2 border-slate-500 shadow-inner ${colors.windowHover} transition-colors`}
            ></div>
          ))}
        </div>

        {/* Door */}
        <div className={`self-center w-20 h-16 ${colors.door} rounded-t-lg border-x-4 border-t-4 border-slate-800 relative ${colors.doorHover} transition-colors`}>
          <div className="absolute top-1/2 left-2 w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>

        {/* Hover Label */}
        {isHovered && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold animate-bounce">
              {building.hasGraph ? 'Click to Enter' : 'Coming Soon'}
            </span>
          </div>
        )}

        {/* Building Name */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 font-bold text-sm">
          {building.name}
        </div>
      </div>

      {/* Ground/Grass */}
      <div className="w-full h-6 bg-green-600 rounded-full mt-[-4px] z-[-1]" style={{ marginLeft: '-50px', width: `${building.width + 100}px` }}></div>
    </div>
  );
};