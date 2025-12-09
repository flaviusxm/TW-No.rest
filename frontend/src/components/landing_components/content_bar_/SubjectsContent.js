import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function SubjectsContent({ selected_category, setter_subjects, setter_selected_categories }) {

    const [notes, setter_notes] = useState([]);
    const [loading, setter_loading] = useState(false);
    const [creating_note, setter_creating_note] = useState(false);
    const [current_note, setCurrentNote] = useState(null); 
    const [deletingNoteId, setDeletingNoteId] = useState(null);

    const saveTimer = useRef(null);
    const lastSavedState = useRef(null);

    const subjectId = useMemo(() => selected_category?.id ?? selected_category?.subject_id, [selected_category]);
    useEffect(() => {
        const fetch_notes = async () => {
            if (!subjectId) return;
            setter_loading(true);
            try {
                const resp = await fetch(`http://localhost:5019/subjects/${subjectId}`, { credentials: "include" });
                if (resp.ok) {
                    const data = await resp.json();
                    setter_notes(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Eroare incarcare note:", err);
            } finally {
                setter_loading(false);
            }
        }
        fetch_notes();
    }, [subjectId]);

    const handler_note_click = async (note) => {
        try {
            const id = note.id ?? note.note_id;
            const resp = await fetch(`http://localhost:5019/notes/${id}`, { credentials: "include" });
            if (!resp.ok) return;

            const selected_note = await resp.json();
            
            const fullNote = {
                ...selected_note,
                subject_id: subjectId,
                subject_name: selected_category?.name,
                tag_id: selected_note.tag_id ? parseInt(selected_note.tag_id) : null 
            };

            setCurrentNote(fullNote);
            lastSavedState.current = fullNote;
        } catch (err) {
            console.error("Eroare la click notita:", err);
        }
    };

    const handler_create_note = async () => {
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

            if (resp.ok) {
                const new_note = await resp.json();
                const withSubject = { 
                    ...new_note, 
                    subject_id: subjectId, 
                    subject_name: selected_category?.name,
                    tag_name: null 
                };
                setter_notes(prev => [withSubject, ...prev]);
            }
        } catch (err) { console.error(err); } 
        finally { setter_creating_note(false); }
    };

    const handler_delete_note = async (noteId, e) => {
        e.stopPropagation();
        if (!window.confirm('Stergi notita?')) return;
        setDeletingNoteId(noteId);
        try {
            const resp = await fetch(`http://localhost:5019/notes/${noteId}`, { method: "DELETE", credentials: "include" });
            if (resp.ok) {
                setter_notes(prev => prev.filter(n => (n.id ?? n.note_id) !== noteId));
                if (current_note?.id === noteId) setCurrentNote(null);
            }
        } catch (err) { console.error(err); } 
        finally { setDeletingNoteId(null); }
    };
    const handler_delete_subject = async () => {
        if (!window.confirm(`Stergi subiectul "${selected_category.name}" si toate notitele?`)) return;
        try {
            const resp = await fetch(`http://localhost:5019/subjects/${subjectId}`, { method: "DELETE", credentials: "include" });
            if (resp.ok) {
                setter_subjects(prev => prev.filter(s => (s.id ?? s.subject_id) !== subjectId));
                setter_selected_categories(null);
            }
        } catch (err) { console.error(err); }
    }

    useEffect(() => {
        if (!current_note?.id) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);

        saveTimer.current = setTimeout(async () => {
            if (lastSavedState.current &&
                current_note.title === lastSavedState.current.title &&
                current_note.description === lastSavedState.current.description &&
                current_note.markdown_content === lastSavedState.current.markdown_content &&
                current_note.course_date === lastSavedState.current.course_date &&
                current_note.tag_id === lastSavedState.current.tag_id 
            ) { return; }

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
                        subject_id: subjectId,
                        tag_id: current_note.tag_id || null
                    })
                });

                if (resp.ok) {
                    const updated = await resp.json();
                    let tagName = updated.tag_name; 
                    
                    
                    if (!tagName && updated.tag_id) {
                        if (updated.tag_id === 1) tagName = "Curs";
                        else if (updated.tag_id === 2) tagName = "Seminar";
                        else if (updated.tag_id === 3) tagName = "Diverse";
                    }

                    const merged = { 
                        ...current_note, 
                        ...updated,
                        tag_id: updated.tag_id ? parseInt(updated.tag_id) : null,
                        tag_name: tagName 
                    };

                    lastSavedState.current = merged;
                    setter_notes(prev => prev.map(n => {
                        const nid = n.id ?? n.note_id;
                        const cid = merged.id ?? merged.note_id;
                        if(nid === cid) {
                            return { ...n, ...merged }; 
                        }
                        return n;
                    }));
                }
            } catch (e) { console.error('Autosave error', e); }
        }, 800); 

        return () => clearTimeout(saveTimer.current);
    }, [current_note]); 


//edit_view
    if (current_note) {
        return (
            <div className="flex-1 bg-gray-50 p-6 overflow-auto h-full">
                <button onClick={() => setCurrentNote(null)} className="mb-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-1">
                    ← Back to List
                </button>

                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    {/* Header */}
                    <div className="flex gap-6 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={current_note.title || ''}
                                onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-[#4E8DC4] outline-none pb-2"
                                placeholder="Note title..."
                            />
                        </div>

                        {/* selector */}
                        <div className="w-1/4 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                            <select
                                value={current_note.tag_id || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCurrentNote(prev => ({ 
                                        ...prev, 
                                        tag_id: val === "" ? null : parseInt(val) 
                                    }));
                                }}
                                className="w-full text-lg border-b-2 border-gray-200 pb-2 bg-transparent focus:border-[#4E8DC4] outline-none cursor-pointer"
                            >
                                <option value="">-- Select --</option>
                                <option value="1">Curs</option>
                                <option value="2">Seminar</option>
                                <option value="3">Diverse</option>
                            </select>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={current_note.description || ''}
                                onChange={(e) => setCurrentNote(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none"
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Date</label>
                            <input
                                type="date"
                                value={current_note.course_date || ''}
                                onChange={(e) => setCurrentNote(prev => ({ ...prev, course_date: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea
                            value={current_note.markdown_content || ''}
                            onChange={(e) => setCurrentNote(prev => ({ ...prev, markdown_content: e.target.value }))}
                            rows={16}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none font-mono text-sm"
                            placeholder="Start typing..."
                        />
                    </div>
                </div>
            </div>
        );
    }

    //list_notes_view
    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto h-full">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{selected_category.name}</h2>
                    <p className="text-gray-500 text-sm">{notes.length} notes</p>
                </div>
                <button onClick={handler_delete_subject} className="text-red-500 hover:bg-red-50 p-2 rounded" title="Delete Subject">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>

            <button
                onClick={handler_create_note}
                disabled={creating_note}
                className="mb-6 w-full py-2 bg-[#4E8DC4] text-white rounded-lg hover:bg-[#3b78a2] transition flex justify-center gap-2 items-center"
            >
                {creating_note ? "Creating..." : "+ New Note"}
            </button>

            {loading ? <p className="text-center text-gray-500">Loading notes...</p> : (
                <ul className="space-y-3">
                    {notes.map(note => {
                        const noteId = note.id ?? note.note_id;
                        return (
                            <li key={noteId} onClick={() => handler_note_click(note)} className="bg-white p-4 rounded-lg shadow-sm border hover:border-[#4E8DC4] cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 mb-1">{note.title || 'Untitled'}</h3>
                                        {note.description && <p className="text-sm text-gray-500 line-clamp-1">{note.description}</p>}
                                    </div>

                                    
                                    <button onClick={(e) => handler_delete_note(noteId, e)} className="text-gray-300 hover:text-red-500 ml-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                {/* footer*/}
                                <div className="mt-2 pt-2 border-t flex items-center justify-between text-xs text-gray-500">
                                    
                                    {/* stanga */}
                                    <div className="flex items-center gap-3">
                                        {note.tag_name ? (
                                            <span className="bg-blue-100 text-[#4E8DC4] px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                                                {note.tag_name}
                                            </span>
                                        ) : null}

                                        {/* data curs */}
                                        <span className="flex items-center gap-1">
                                            {note.course_date ? (
                                                <>
                                                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span className={note.course_date ? "text-gray-700" : "italic text-gray-400"}>
                                                        {note.course_date}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="italic text-gray-300">No date</span>
                                            )}
                                        </span>
                                    </div>

                                    {/* dreapta */}
                                    <span className="text-gray-400">
                                        {new Date(note.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
            {notes.length === 0 && !loading && <div className="text-center text-gray-400 mt-10">No notes in this subject yet.</div>}
        </div>
    );
}