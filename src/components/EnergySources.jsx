import React, { useState } from "react";

function EnergySources({ energySources, handleDragStart, isTouchDevice }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [touchHoldTimeout, setTouchHoldTimeout] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleTouchStart(e, key) {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      
      const startTime = Date.now();
      setTouchStartTime(startTime);
      
      const timeout = setTimeout(() => {
        console.log('Starting drag for:', key);
        setDraggedItem(key);
        setIsDragging(true);
        handleDragStart(e, key);
        
        // Prevent scrolling during drag
        document.body.style.overflow = 'hidden';
      }, 500);
      
      setTouchHoldTimeout(timeout);
    }
  }

  function handleTouchEnd(e, key) {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      
      if (touchHoldTimeout) {
        clearTimeout(touchHoldTimeout);
        setTouchHoldTimeout(null);
      }
      
      const touchDuration = Date.now() - touchStartTime;
      
      // Only show popup if it was a quick tap and not dragging
      if (touchDuration < 500 && !isDragging) {
        setShowPopup(key);
        document.body.style.overflow = '';
      }
      
      // For drag operations, clean up after a delay to allow grid to detect the drop
      if (isDragging) {
        console.log('Drag ended for:', key);
        setTimeout(() => {
          setDraggedItem(null);
          setIsDragging(false);
          document.body.style.overflow = '';
        }, 200); // Increased delay to ensure grid has time to process
      }
      
      setTouchStartTime(null);
    }
  }

  function handleTouchMove(e) {
    if (isTouchDevice && draggedItem) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleClick(e, key) {
    e.preventDefault();
    e.stopPropagation();
    if (!isTouchDevice) {
      setShowPopup(key);
    }
  }

  function handleMouseDown(e, key) {
    if (!isTouchDevice) {
      setDraggedItem(key);
    }
  }

  function handleDragEnd() {
    setDraggedItem(null);
    document.body.style.overflow = '';
  }

  function closePopup() {
    setShowPopup(null);
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
        onDragEnd={function() { handleDragEnd(); }}
        onTouchStart={function(e) { handleTouchStart(e, key); }}
        onTouchMove={function(e) { handleTouchMove(e); }}
        onTouchEnd={function(e) { handleTouchEnd(e, key); }}
        onMouseDown={function(e) { handleMouseDown(e, key); }}
        onClick={function(e) { handleClick(e, key); }}
        className={`p-3 rounded-lg cursor-pointer hover:shadow-lg transition-all ${source.color} text-white touch-manipulation ${isDragging && draggedItem === key ? 'opacity-50 scale-95' : ''}`}
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
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
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

      {/* Mobile drag indicator */}
      {isDragging && isTouchDevice && draggedItem && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          <div className="text-center">
            <div className="font-bold">Dragging {energySources[draggedItem].name}</div>
            <div className="text-sm">Touch a grid cell to place</div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {energySources[showPopup].name} Details
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Base Cost:</span>
                <span>${energySources[showPopup].cost}M</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Energy Production:</span>
                <span className="text-yellow-600 font-bold">
                  {energySources[showPopup].energyProduction} kWh/year
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Emissions:</span>
                <span className="text-red-600">
                  {energySources[showPopup].emissions} units/year
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Public Approval:</span>
                <span className={energySources[showPopup].approval >= 0 ? "text-green-600" : "text-red-600"}>
                  {energySources[showPopup].approval >= 0 ? "+" : ""}{energySources[showPopup].approval}%
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Actual values may vary based on terrain modifiers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergySources;
