import React from 'react';

export default function DetailsBar({ selected_note }) {
  return (
    <div className="w-full bg-white  p-2 overflow-auto">
      {selected_note ? (
        <div>
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Note Details</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Last updated:</span>
            </div>
          </div>

    
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                defaultValue={selected_note.title || "Untitled Note"}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
              />
            </div>

            
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="fmedium text-gray-600 mb-2">No Note Selected</h3>
         
        </div>
      )}
    </div>
  );
}