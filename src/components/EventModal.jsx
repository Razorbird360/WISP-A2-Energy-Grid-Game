import React from "react";

function EventModal({ currentEvent, setCurrentEvent }) {
  if (!currentEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">📰 Breaking News!</h3>
        <h4 className="font-semibold mb-2">{currentEvent.name}</h4>
        <p className="mb-4">{currentEvent.description}</p>
        <button
          onClick={function() { setCurrentEvent(null); }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default EventModal;
