import React, { useEffect, useState } from 'react';

export default function ContentBar({selected_category,setter_selected_note,setter_subjects,setter_selected_categories}) {
  
    const [notes, setter_notes] = useState([]);
  const [loading, setter_loading] = useState(false);
  const [creating_note, setter_creating_note] = useState(false);
  const [editing_new_note, setter_editing_new_note] = useState(false);
  const [new_note_data, setter_new_note_data] = useState({
    id: Math.random()*10000,
    title: 'New Note',
    markdown_content: '',
    description: '',
    course_date: new Date().toISOString().split('T')[0]
  });
  useEffect(()=>{
    const fetch_notes=async ()=>{
    if(!selected_category){setter_notes([]);return;}
    setter_loading(true);

    try{
      const subject_id=selected_category.id ?? selected_category.subject_id;
      const resp=await fetch(`http://localhost:5000/subjects/${subject_id}`,{credentials:"include"});
      if(resp.ok){const data=await resp.json();setter_notes(data)}else{setter_notes([])}
    }catch(err){
      console.error("Eroare incarcare materii",err);setter_notes([]);
    }finally{ setter_loading(false)}
  }
  fetch_notes();
  },[selected_category])
  const handler_note_click = (note) => {
    setter_new_note_data({  
      id: note.id ?? note.note_id,
      title: note.title,
      description:note.description||'',
      markdown_content: note.markdown_content || '',
      course_date: note.course_date || new Date().toISOString().split('T')[0]
    });
    setter_editing_new_note(true);  
};
  const handler_delete_subject=async(e)=>{
    e.stopPropagation();
    if(!window.confirm(`Are you sure you want to delete this subject, indeed all notes "${selected_category.name}" ?'`)){return;}
  try{
    const subject_id=selected_category.id?? selected_category.subject_id;
    const resp=await fetch(`http://localhost:5000/subjects/${subject_id}`,{
      method:"DELETE",
      credentials:"include",
      headers:{
        "Content-type":"application/json"
      }
    });
    if(!resp.ok){console.error("Eroare la stergerea subiectului !");}
    setter_subjects(prev=>prev.filter(subject=>{
      const sub_id=subject_id??subject.subject_id;
      return sub_id!==subject_id;
    }))
    setter_selected_categories(null);
    setter_selected_note(null);
  }catch(err){
    console.error("Eroare la stergerea subiectului",err);
  }
  }
  const handler_create_note = async () => {
    if (!selected_category) {
      console.error('No subject selected!');
      return;
    }

    setter_creating_note(true);
    
    try {
      const subject_id = selected_category.id ?? selected_category.subject_id;
      const resp = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Note',
          subject_id: subject_id,
        })
      });

      if (resp.ok) {
        const new_note = await resp.json();
         setter_new_note_data({
          id: new_note.id,
          title: new_note.title,
          description:new_note.description||'',
          markdown_content: new_note.markdown_content || '',
          course_date: new_note.course_date || new Date().toISOString().split('T')[0]
        });
         setter_editing_new_note(true);
        setter_notes(prev => [new_note, ...prev]);
      } else {
        console.error('Failed to create note');
      }
    } catch (err) {
      console.error('Error creating note:', err);
    } finally {
      setter_creating_note(false);
    }
  };
const handler_save_note=async()=>{
  if(!new_note_data.id)return;
  try{
const resp=await fetch(`http://localhost:5000/notes/${new_note_data.id}`,{
    method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: new_note_data.title,
          description:new_note_data.description,
          markdown_content: new_note_data.markdown_content,
          course_date: new_note_data.course_date
        })
      });

      if (resp.ok) {
        const updated_note = await resp.json();
        setter_notes(prev => prev.map(note => (note.id ?? note.note_id) === new_note_data.id ? updated_note : note));
        setter_editing_new_note(false);
        setter_selected_note(updated_note);
      }
    }
  catch(err){console.error("Eroare salvare notita",err)}
}
const handler_cancel_edit = () => {
    setter_editing_new_note(false);
    setter_new_note_data({
      id: Math.random()*10000,
      title: 'New Note',
      description:'',
      markdown_content: '',
      course_date: new Date().toISOString().split('T')[0]
    });
  };
if (!selected_category) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Content</h2>
          <p className="text-gray-600 text-sm">
            Select a subject, tag or group to view content
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-600 mb-2">No Selection</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Click on a subject, tag, or group from the sidebar to view its content here.
            The content will automatically update based on your selection.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{selected_category.name}</h2>
          <p className="text-gray-600 text-sm">Loading notes...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-[#4E8DC4] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // edit mode
  if (editing_new_note ) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        
        <button
          onClick={handler_cancel_edit}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4E8DC4] mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to {selected_category.name}</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={new_note_data.title}
              onChange={(e) => setter_new_note_data(prev => ({...prev, title: e.target.value}))}
              className="w-full text-2xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-[#4E8DC4] outline-none pb-2"
              placeholder="Note title..."
            />
          </div>

          {/* ds & date*/}
       <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={new_note_data.description}
                onChange={(e) => setter_new_note_data(prev => ({...prev, description: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
                placeholder="Add a brief description..."
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Date
              </label>
              <input
                type="date"
                value={new_note_data.course_date}
                onChange={(e) => setter_new_note_data(prev => ({...prev, course_date: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
              />
            </div>
          </div>

          {/*md*/}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown)
            </label>
            <textarea
              value={new_note_data.markdown_content}
              onChange={(e) => setter_new_note_data(prev => ({...prev, markdown_content: e.target.value}))}
              rows={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4] font-mono text-sm"
              placeholder="Start writing your note content here...

You can use Markdown:
# Heading
## Subheading
- List item
**bold** *italic*"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handler_cancel_edit}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handler_save_note}
              className="px-6 py-2 bg-[#4E8DC4] text-white rounded-lg hover:bg-[#3b78a2] transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    );
  }

// initial listv
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800">{selected_category.name}</h2>
          <button
            onClick={handler_delete_subject}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete subject"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        {selected_category.description && (
          <p className="text-gray-600 text-sm mb-3 italic">
            {selected_category.description}
          </p>
        )}
        
        <p className="text-gray-600 text-sm">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </p>
      </div>

      <div className="mb-4">
        <button 
          className="px-4 py-2 bg-[#4E8DC4] text-white rounded-lg hover:bg-[#3b78a2] transition-colors text-sm disabled:opacity-50"
          onClick={handler_create_note}
          disabled={creating_note}
        >
          <span className="flex items-center gap-2">
            {creating_note ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Note
              </>
            )}
          </span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-600 mb-2">No Notes Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            This subject doesn't have any notes yet. Click "New Note" to get started!
          </p>
        </div>
      ) 
      :
       (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id ?? note.note_id}
              onClick={() => handler_note_click(note)}
              className="bg-white p-4 rounded-lg shadow-sm border hover:border-[#4E8DC4] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 group-hover:text-[#4E8DC4] transition-colors">
                  {note.title || 'Untitled Note'}
                </h3>
              </div>
              
              {note.content && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {note.content}
                </p>
              )}
              
              <div className="flex gap-2 mt-3">
                {note.tags && note.tags.length > 0 && note.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {tag.name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}