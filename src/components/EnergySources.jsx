import React, { useState } from "react";

function EnergySources({ energySources, handleDragStart, handleEnergySelect, selectedEnergy, isTouchDevice }) {
  const [draggedItem, setDraggedItem] = useState(null);

  function handleTouchStart(e, key) {
    e.preventDefault();
    setDraggedItem(key);
    // For mobile devices, use tap-to-select instead of drag
    if (isTouchDevice) {
      handleEnergySelect(key);
    } else {
      // Create a mock drag event for consistency with existing drag handlers
      const mockEvent = {
        dataTransfer: {
          effectAllowed: "move"
        }
      };
      handleDragStart(mockEvent, key);
    }
  }

  function handleClick(e, key) {
    e.preventDefault();
    e.stopPropagation();
    if (isTouchDevice) {
      handleEnergySelect(key);
    }
  }

  function renderEnergySource(key, source) {
    const isSelected = selectedEnergy === key;
    
    return (
      <div
        key={key}
        draggable={!isTouchDevice}
        onDragStart={function(e) { 
          if (!isTouchDevice) {
            handleDragStart(e, key); 
          }
        }}
        onTouchStart={function(e) { handleTouchStart(e, key); }}
        onClick={function(e) { handleClick(e, key); }}
        className={`p-3 rounded-lg cursor-move hover:shadow-lg transition-all ${source.color} text-white touch-manipulation ${draggedItem === key ? 'opacity-75 scale-95' : ''} ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}`}
        style={{ 
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <div className="flex items-center justify-between">
          <img 
            src={source.image} 
            alt={source.name}
            className="w-8 h-8 object-contain"
            style={{ 
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          />
          <div className="text-right">
            <div className="font-bold">{source.name}</div>
            <div className="text-sm opacity-90">${source.cost}M</div>
          </div>
        </div>
        {isSelected && isTouchDevice && (
          <div className="mt-2 text-xs opacity-90 text-center">
            ✓ Selected - Tap a grid cell to place
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        🔋 Energy Sources
        {isTouchDevice && (
          <div className="text-sm font-normal text-gray-600 mt-1">
            Tap to select, then tap grid to place
          </div>
        )}
      </h2>
      <div className="space-y-3">
        {Object.entries(energySources).map(function([key, source]) {
          return renderEnergySource(key, source);
        })}
      </div>
    </div>
  );
}

export default EnergySources;
