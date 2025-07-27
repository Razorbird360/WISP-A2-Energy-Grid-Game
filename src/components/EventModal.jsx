import React from "react";

function EventModal({ currentEvent, setCurrentEvent }) {
  if (!currentEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">📰 Breaking News!</h3>
        <h4 className="font-semibold mb-2">{currentEvent.name}</h4>
        <p className="mb-4">{currentEvent.description}</p>
        <div className="mb-4">
          <h5 className="font-semibold">Effects:</h5>
          <ul className="list-disc list-inside ml-4">
            {Object.entries(currentEvent.effect).map(([key, val]) => {
              // handle demand multiplier specially
              if (key === 'demand') {
                return <li key={key}>Demand ×{val}</li>;
              }
              if (typeof val === 'object' && val !== null) {
                return Object.entries(val).map(([metric, change]) => (
                  <li key={`${key}-${metric}`}>{
                    `${key.charAt(0).toUpperCase() + key.slice(1)} ${metric.charAt(0).toUpperCase() + metric.slice(1)} ${change > 0 ? '+' : ''}${change}`
                  }</li>
                ));
              }
              // flat effect (cost, approval, reliability)
              const label = key === 'cost' ? 'Budget' : key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <li key={key}>{`${label} ${val > 0 ? '+' : ''}${val}`}</li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={function () { setCurrentEvent(null); }}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default EventModal;
