
export default function DetailsBar({ selected_note }) {
  if (!selected_note) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 
                  01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-600 mb-2">No Note Selected</h3>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 overflow-auto">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Note Details</h3>


<div className="mb-2 text-sm text-gray-500">
        <strong>Title:</strong>
        <div className="text-gray-600">
          {selected_note.title}
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        <strong>Created:</strong>
        <div className="text-gray-600">
          {new Date(selected_note.created_at).toLocaleString()}
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        <strong>Last updated:</strong>
        <div className="text-gray-600">
          {new Date(selected_note.updated_at).toLocaleString()}
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        <strong>Subject:</strong>
        <div className="text-gray-600">{selected_note.subject_name || selected_note.subject?.name || "-"}</div>
      </div>
    </div>
  );
}
