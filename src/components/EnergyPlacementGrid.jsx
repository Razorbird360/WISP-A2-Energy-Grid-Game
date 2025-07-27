import React from "react";
import { toast } from "../utils/toastify.js";


function EnergyPlacementGrid({ grid, energySources, handleDragOver, handleDrop, removeFromCell }) 
{
  function getBg(energySourceType) {
    const base = energySources[energySourceType]?.color || 'bg-black';
    return `${base} bg-opacity-90`;
  }


  function renderModifiers(terrain) {
    return Object.entries(terrain.modifier).map(function([key, value]) {
      const modifier = value > 1 ? '+' : '';
      const percentage = Math.round((value - 1) * 100);
      const displayKey = key === 'approval' ? 'public approval' : key;
      return (
        <div key={key}>
          {displayKey}: {modifier}{percentage}%
        </div>
      );
    });
  }

  function renderGridCell(cell, index) {
    return (
      <div
        key={cell.id}
        onDragOver={handleDragOver}
        onDrop={function(e) { handleDrop(e, index); }}
        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-1 sm:p-2 hover:border-blue-400 transition-colors relative group min-w-0 select-none"
        style={{ aspectRatio: '1' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg opacity-50"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
          <div className="text-base sm:text-lg">{cell.terrain.emoji}</div>
          <div className="text-[10px] sm:text-xs font-medium text-gray-700">{cell.terrain.name}</div>
        </div>

        {cell.energySource && (
          <div 
            className={`absolute inset-0 rounded-lg flex items-center justify-center z-20 ${getBg(cell.energySource)}`}
            onClick={function(e) { e.stopPropagation(); }}
          >
            <div className="text-center text-white">
              <img
                src={energySources[cell.energySource].image}
                alt={energySources[cell.energySource].name}
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 object-contain"
              />
              <div className="text-[10px] sm:text-xs font-bold">{energySources[cell.energySource].name}</div>
            </div>
            <button
              onClick={function(e) { 
                e.stopPropagation();
                removeFromCell(index); 
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 text-sm hover:bg-red-600 hover:scale-110 flex items-center justify-center z-30 shadow-lg border-2 border-white transition-all duration-200"
              title="Remove energy source"
            >
              x
            </button>
          </div>
        )}

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-2 rounded whitespace-nowrap z-20 pointer-events-none">
          {renderModifiers(cell.terrain)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">🗺️ Energy Placement Grid (5x5)</h2>
      
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-6 max-w-full">
        {grid.map(function(cell, index) {
          return renderGridCell(cell, index);
        })}
      </div>
    </div>
  );
}

export default EnergyPlacementGrid;
