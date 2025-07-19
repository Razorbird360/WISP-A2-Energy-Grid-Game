import React from "react";

function Header({ gameState, stats }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-center mb-4">⚡Watt & Where?</h1>
      
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
          <div className="text-sm text-blue-600">Approval</div>
        </div>
        <div className="text-center p-3 bg-yellow-100 rounded-lg">
          <div className="font-bold text-yellow-800">{Math.round(stats.reliability)}%</div>
          <div className="text-sm text-yellow-600">Reliability</div>
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
