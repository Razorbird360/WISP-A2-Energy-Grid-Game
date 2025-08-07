import React, { useState } from "react";

function EnergySources({ energySources, handleDragStart, isTouchDevice }) {
  const [draggedItem, setDraggedItem] = useState(null);

  function handleTouchStart(e, key) {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      setDraggedItem(key);
    }
  }

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleMouseDown(e, key) {
    if (!isTouchDevice) {
      setDraggedItem(key);
    }
  }

  function handleDragEnd() {
    setDraggedItem(null);
  }

  function renderEnergySource(key, source) {
    return (
      <div
        key={key}
        draggable={!isTouchDevice}
        onDragStart={function(e) { 
          if (!isTouchDevice) {
            handleDragStart(e, key); 
          }
        }}
        onDragEnd={function() { setDraggedItem(null); }}
        onTouchStart={function(e) { handleTouchStart(e, key); }}
        onMouseDown={function(e) { handleMouseDown(e, key); }}
        onClick={function(e) { handleClick(e); }}
        className={`p-3 rounded-lg cursor-pointer hover:shadow-lg transition-all ${source.color} text-white touch-manipulation`}
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        🔋 Energy Sources
        {isTouchDevice && (
          <div className="text-sm font-normal text-gray-600 mt-1">
            Drag and drop to place on grid
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
