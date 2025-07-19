import React from "react";

function NextYearButton({ nextYear, gameState }) {
  return (
    <div className="text-center mt-6">
      <button
        onClick={nextYear}
        disabled={gameState.gameOver}
        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg"
      >
        📅 Next Year
      </button>
    </div>
  );
}

export default NextYearButton;
