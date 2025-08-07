import React, { useState } from "react";

function Header({ gameState, stats }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative">
      <h1 className="text-3xl font-bold text-center mb-4">⚡Watt & Where?</h1>
      
      <div className="absolute top-4 right-4">
        <div 
          className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-blue-600 transition-colors"
          onClick={() => setShowHelp(!showHelp)}
        >
          ?
        </div>
        
        {showHelp && (
          <div className="absolute top-8 right-0 w-80 bg-black text-white text-sm p-4 rounded-lg z-50 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold">How to Play:</div>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-white hover:text-gray-300 text-lg leading-none"
              >
                x
              </button>
            </div>
            <div className="space-y-2">
              <div>• Drag energy sources to the 5x5 grid</div>
              <div>• Manage your $100M budget over 5 years</div>
              <div>• Balance emissions, energy production & public approval</div>
              <div>• Different terrains affect costs & efficiency</div>
              <div>• Click "Next Year" to advance and face events</div>
              <div>• Aim for low emissions and high energy production!</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="text-center p-3 bg-green-100 rounded-lg">
          <div className="font-bold text-green-800">${gameState.budget}M</div>
          <div className="text-sm text-green-600">Budget</div>
        </div>
        <div className="text-center p-3 bg-red-100 rounded-lg">
          <div className="font-bold text-red-800">{Math.round(stats.emissions)}</div>
          <div className="text-sm text-red-600">Emissions</div>
        </div>
        <div className="text-center p-3 bg-blue-100 rounded-lg">
          <div className="font-bold text-blue-800">{Math.round(gameState.approval)}%</div>
          <div className="text-sm text-blue-600">Public Approval</div>
        </div>
        <div className="text-center p-3 bg-yellow-100 rounded-lg">
          <div className="font-bold text-yellow-800">{Math.round(gameState.energyProduction || 0)} kWh</div>
          <div className="text-sm text-yellow-600">Energy Production</div>
        </div>
        <div className="text-center p-3 bg-purple-100 rounded-lg">
          <div className="font-bold text-purple-800">Year {gameState.year}/5</div>
          <div className="text-sm text-purple-600">Progress</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
