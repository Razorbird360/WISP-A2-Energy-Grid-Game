import React from "react";

function EndGameScreen({ gameState, getBadges, resetGame }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">🏆 Game Complete!</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-800">{Math.round(gameState.emissions)}</div>
            <div className="text-green-600">Total Emissions</div>
          </div>
          <div className="text-center p-4 bg-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-800">${gameState.budget}M</div>
            <div className="text-blue-600">Budget Left</div>
          </div>
          <div className="text-center p-4 bg-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-800">{Math.round(gameState.approval)}%</div>
            <div className="text-purple-600">Public Approval</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-xl">
            <div className="text-2xl font-bold text-yellow-800">{Math.round(gameState.reliability)}%</div>
            <div className="text-yellow-600">Grid Reliability</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">🏅 Badges Earned</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {getBadges().map(function(badge, index) {
              return (
                <span key={index} className="px-4 py-2 bg-yellow-200 rounded-full text-lg font-semibold">
                  {badge}
                </span>
              );
            })}
            {getBadges().length === 0 && (
              <span className="text-gray-500">No badges earned this time</span>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGameScreen;
