import React from "react";

function CitizenFeed({ socialFeed }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">📱 Citizen Feed</h2>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {socialFeed.map(function(comment, index) {
          return (
            <div key={index} className="p-2 bg-gray-100 rounded text-sm">
              {comment}
            </div>
          );
        })}
        {socialFeed.length === 0 && (
          <div className="text-gray-500 text-sm">No comments yet...</div>
        )}
      </div>
    </div>
  );
}

export default CitizenFeed;
