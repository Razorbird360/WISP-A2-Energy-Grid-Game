import React from "react";

function EnergySources({ energySources, handleDragStart }) {
  function renderEnergySource(key, source) {
    return (
      <div
        key={key}
        draggable
        onDragStart={function(e) { handleDragStart(e, key); }}
        className={`p-3 rounded-lg cursor-move hover:shadow-lg transition-all ${source.color} text-white`}
      >
        <div className="flex items-center justify-between">
          <img 
            src={source.image} 
            alt={source.name}
            className="w-8 h-8 object-contain" 
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
      <h2 className="text-xl font-bold mb-4">🔋 Energy Sources</h2>
      <div className="space-y-3">
        {Object.entries(energySources).map(function([key, source]) {
          return renderEnergySource(key, source);
        })}
      </div>
    </div>
  );
}

export default EnergySources;
