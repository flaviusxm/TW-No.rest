import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function ContentBar({selected_category,setter_selected_note,setter_subjects,setter_selected_categories}) {
  
  const [notes, setter_notes] = useState([]);
  const [loading, setter_loading] = useState(false);
  const [creating_note, setter_creating_note] = useState(false);
  const [current_note, setCurrentNote] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const saveTimer = useRef(null);
  const lastSavedState = useRef(null);

  const subjectId = useMemo(() => selected_category?.id ?? selected_category?.subject_id, [selected_category]);
  
  useEffect(()=>{
    const fetch_notes=async ()=>{
      if(!selected_category){console.warn('Nu este selectat niciun subiect — nu pot incarca notele.'); setter_notes([]);return;}
      setter_loading(true);

      try{
        const subject_id=selected_category.id ?? selected_category.subject_id;
        if(!subject_id){
          console.error('Subject invalid: lipseste id-ul subiectului.');
          setter_notes([]);
          return;
        }
        const resp=await fetch(`http://localhost:5019/subjects/${subject_id}`,{credentials:"include"});
        if(resp.ok){
          const data=await resp.json();
          console.log('Notes fetched:', data);
          setter_notes(Array.isArray(data) ? data : []);
        } else {
          console.error(`Eroare la fetch notes, status: ${resp.status}`);
          setter_notes([]);
        }
      }catch(err){
        console.error("Eroare incarcare note:", err); 
        setter_notes([]);
      }finally{ 
        setter_loading(false);
      }
    }
    fetch_notes();
  },[selected_category])

  const handler_note_click = async (note) => {
    console.log('Note clicked:', note); 
    try {
      const id = note.id ?? note.note_id;
      console.log('Fetching note details for ID:', id); 
      
      const resp = await fetch(`http://localhost:5019/notes/${id}`, {
        credentials: "include",
      });

      console.log('Response status:', resp.status); 

      if (!resp.ok) {
        console.log('Failed to fetch note details');
        return;
      }

      const selected_note = await resp.json();
      console.log('Note details received:', selected_note); 

      const withSubject = {
        ...selected_note,
        subject_id: selected_note.subject_id ?? subjectId,
        subject_name: selected_note.subject_name ?? selected_category?.name,
        subject: selected_category ?? selected_note.subject,
      };

      console.log('Final note object:', withSubject);
      
      setCurrentNote(withSubject);
      setter_selected_note(withSubject);
      lastSavedState.current=withSubject;
    } catch (err) {
      console.error("Error loading note details:", err);
    }
  };

  
  const handler_delete_note = async (noteId, e) => {
    e.stopPropagation(); 
    setDeletingNoteId(noteId);
    
    if(!window.confirm('Are you sure you want to delete this note?')) {
      setDeletingNoteId(null);
      return;
    }
    
    try {
      const resp = await fetch(`http://localhost:5019/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      
      if (!resp.ok) {
        console.error("Eroare la stergerea notitei!");
        return;
      }
      
  
      setter_notes(prev => prev.filter(note => {
        const nid = note.id ?? note.note_id;
        return nid !== noteId;
      }));
      

      if (current_note && (current_note.id === noteId || current_note.note_id === noteId)) {
        setCurrentNote(null);
        setter_selected_note(null);
      }
      
    } catch (err) {
      console.error("Eroare la stergerea notitei", err);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handler_delete_subject = async (e) => {
    e.stopPropagation();
    if(!window.confirm(`Are you sure you want to delete this subject and all its notes "${selected_category.name}"?`)){return;}
    
    try {
      const subject_id = selected_category.id ?? selected_category.subject_id;
      const resp = await fetch(`http://localhost:5019/subjects/${subject_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      
      if(!resp.ok) {
        console.error("Eroare la stergerea subiectului !");
        return;
      }
      
      setter_subjects(prev => prev.filter(subject => {
        const sub_id = subject.id ?? subject.subject_id;
        return sub_id !== subject_id;
      }));
      
      setter_selected_categories(null);
      setter_selected_note(null);
      setCurrentNote(null);
      setter_notes([]);
      
    } catch (err) {
      console.error("Eroare la stergerea subiectului", err);
    }
  }

  const handler_create_note = async () => {
    if (!selected_category) { console.error('Nu poti crea o nota fara un subiect selectat.'); return; }
    if (!subjectId) { console.error('Nu exista subjectId pentru nota noua. Selecteaza un subiect valid.'); return; }
    setter_creating_note(true);
    try {
      const resp = await fetch('http://localhost:5019/notes', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Note',
          subject_id: subjectId,
          description: '',
          markdown_content: '',
        })
      });
      
      if (!resp.ok) { console.error(`Eroare creare nota, status: ${resp.status}`); return; }
      const new_note = await resp.json();
      console.log('New note created:', new_note); 
      
      const withSubject = { 
        ...new_note, 
        subject_id: subjectId, 
        subject_name: selected_category?.name,
        subject: selected_category 
      };
      
      setter_notes(prev => [withSubject, ...prev]);
      setCurrentNote(withSubject);
      setter_selected_note(withSubject);
      lastSavedState.current=withSubject;
    } catch (err) {
      console.error('Error creating note:', err);
    } finally {
      setter_creating_note(false);
    }
  };

  useEffect(() => {
    if (!current_note?.id) return;
    
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    saveTimer.current = setTimeout(async () => {

      if(lastSavedState.current)
      {const isUnchanged=current_note.title === lastSavedState.current.title &&
        (current_note.description || '') === (lastSavedState.current.description || '') &&
        (current_note.markdown_content || '') === (lastSavedState.current.markdown_content || '') &&
        current_note.course_date === lastSavedState.current.course_date;
        if(isUnchanged){
          return;
        }
        }
      try {
        const resp = await fetch(`http://localhost:5019/notes/${current_note.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: current_note.title,
            description: current_note.description || '',
            content: current_note.markdown_content,
            course_date: current_note.course_date,
            subject_id: current_note.subject_id ?? subjectId,
          })
        });
        
        if (!resp.ok) { console.error(`Eroare la autosave, status: ${resp.status}`); return; }
        const updated = await resp.json();
        const merged = { 
          ...updated, 
          subject_id: updated.subject_id ?? subjectId, 
          subject_name: current_note.subject_name ?? selected_category?.name,
          subject: current_note.subject ?? selected_category 
        };
        
        lastSavedState.current=merged;
        setCurrentNote(merged);
        setter_selected_note(merged);
        setter_notes(prev => prev.map(n => (n.id ?? n.note_id) === merged.id ? merged : n));
      } catch (e) {
        console.error('Autosave error', e);
      }
    }, 800);
    
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [current_note?.title, current_note?.description, current_note?.markdown_content, current_note?.course_date]);

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

  if (current_note) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => {
              setCurrentNote(null);          
              setter_selected_note(null);     
            }}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
          
       
        </div>
       
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={current_note.title || ''}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-2xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-[#4E8DC4] outline-none pb-2"
                placeholder="Note title..."
              />
            </div>

        
            <div className="w-1/4 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <div className="w-full text-lg text-gray-500 border-b-2 border-gray-200 pb-2 truncate">
                {current_note.tag_name || "none"}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={current_note.description || ''}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
                placeholder="Add a brief description..."
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Date</label>
              <input
                type="date"
                value={current_note.course_date || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCurrentNote(prev => ({ ...prev, course_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
            <textarea
              value={current_note.markdown_content || ''}
              onChange={(e) => setCurrentNote(prev => ({ ...prev, markdown_content: e.target.value }))}
              rows={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E8DC4] font-mono text-sm"
              placeholder="Start writing your note content here..."
            />
          </div>
        </div>
      </div>
    );
  }

  // initial list view
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800">{selected_category.name}</h2>
          <button
            onClick={handler_delete_subject}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete subject and all notes"
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
                New Note (auto-save)
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
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => {
            const noteId = note.id ?? note.note_id;
            const isDeleting = deletingNoteId === noteId;
            
            return (
              <li
                key={noteId}
                onClick={() => !isDeleting && handler_note_click(note)}
                className="bg-white p-4 rounded-lg shadow-sm border hover:border-[#4E8DC4] hover:shadow-md transition-all cursor-pointer group relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#4E8DC4] transition-colors">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.description && (
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                      {note.tag_name || 'none'}
                    </p>
                    )}
                  </div>
            
                  <button
                    onClick={(e) => handler_delete_note(noteId, e)}
                    disabled={isDeleting}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    title="Delete note"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>
                    )}
                  </button>
                </div>
                
                {note.content && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {note.content}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {note.course_date && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {note.course_date}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {note.updated_at && (
                      <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}