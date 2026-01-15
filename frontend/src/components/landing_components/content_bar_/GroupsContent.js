import React, { useEffect, useState, useRef } from 'react';

export default function GroupsContent({ selected_group }) {
    // --- STATE-URI ---
    const [groupNotes, setGroupNotes] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- STATE EDITOR ---
    const [current_note, setCurrentNote] = useState(null);
    const saveTimer = useRef(null);
    const lastSavedState = useRef(null);

    // --- STATE MODALE ---
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);

    // --- STATE SEARCH ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [personalNotes, setPersonalNotes] = useState([]);
    const [loadingPersonalNotes, setLoadingPersonalNotes] = useState(false);

    const groupId = selected_group?.id ?? selected_group?.group_id;

    // --- PLACEHOLDERS PENTRU EDITOR ---
    const tagPlaceholders = {
        1: "Ce s-a predat la curs? Notează ideile principale...",
        2: "Rezolvări de la seminar sau teme...",
        3: "Alte informații utile, link-uri sau idei..."
    };

    // --- 1. REFRESH DATA ---
    const refreshGroupData = async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            // Fetch Note
            const notesResp = await fetch(`http://localhost:5019/groups/${groupId}`, { credentials: "include" });
            if (notesResp.ok) {
                const data = await notesResp.json();
                // Asiguram ca e array
                const notesList = Array.isArray(data) ? data : (data.notes || []);
                setGroupNotes(notesList);
            }

            // Fetch Membri
            const membersResp = await fetch(`http://localhost:5019/groups/${groupId}/members`, { credentials: "include" });
            if (membersResp.ok) {
                setGroupMembers(await membersResp.json());
            }
        } catch (err) {
            console.error("Eroare refresh:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshGroupData();
        setCurrentNote(null);
    }, [groupId]);

    // --- 2. NOTE ACTIONS ---
    const handler_note_click = async (note) => {
        try {
            const id = note.id ?? note.note_id;
            const resp = await fetch(`http://localhost:5019/notes/${id}`, { credentials: "include" });
            if (resp.ok) {
                const selected = await resp.json();
                const tId = selected.tag_id ? parseInt(selected.tag_id) : null;
                setCurrentNote({ ...selected, tag_id: tId });
                lastSavedState.current = selected;
            }
        } catch (e) { console.error(e); }
    };

    const handler_delete_note = async (noteId, e) => {
        e.stopPropagation();
        if (!window.confirm("Esti sigur ca vrei sa stergi notita?")) return;

        try {
            const resp = await fetch(`http://localhost:5019/notes/${noteId}`, { method: "DELETE", credentials: "include" });
            if (resp.ok) {
                setGroupNotes(prev => prev.filter(n => (n.id ?? n.note_id) !== noteId));
                if (current_note?.id === noteId) setCurrentNote(null);
            } else {
                alert("Eroare la stergere.");
            }
        } catch (err) { console.error(err); }
    };

    // Auto-save
    useEffect(() => {
        if (!current_note?.id) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
            if (lastSavedState.current && JSON.stringify(current_note) === JSON.stringify(lastSavedState.current)) return;
            try {
                await fetch(`http://localhost:5019/notes/${current_note.id}`, {
                    method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(current_note)
                });
                refreshGroupData();
            } catch (e) { console.error(e); }
        }, 800);
        return () => clearTimeout(saveTimer.current);
    }, [current_note]);

    // --- 3. MODAL ACTIONS ---
    const handleAddMember = async (user) => {
        const uId = user.id ?? user.user_id;
        const res = await fetch(`http://localhost:5019/groups/${groupId}/members`, {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uId })
        });
        if (res.ok) {
            setShowMemberModal(false); setSearchTerm(''); refreshGroupData(); alert("Membru adaugat!");
        } else {
            const err = await res.json();
            alert("Eroare: " + (err.message || "Nu s-a putut adauga membrul"));
        }
    };

    const handleShareNote = async (note) => {
        const nId = note.id ?? note.note_id;
        const res = await fetch(`http://localhost:5019/groups/${groupId}/notes`, {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ noteId: nId })
        });
        if (res.ok) {
            setShowNoteModal(false); refreshGroupData(); alert("Notita partajata!");
        } else {
            const err = await res.json();
            alert("Eroare: " + (err.message || "Nu s-a putut partaja notita"));
        }
    };

    // Search logic
    useEffect(() => {
        if (searchTerm.length < 2) { setSearchResults([]); return; }
        const delay = setTimeout(async () => {
            setIsSearching(true);
            const res = await fetch(`http://localhost:5019/users/search?q=${encodeURIComponent(searchTerm)}`, { credentials: "include" });
            if (res.ok) setSearchResults(await res.json());
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const fetchPersonalNotes = async () => {
        setLoadingPersonalNotes(true);
        const res = await fetch(`http://localhost:5019/notes`, { credentials: "include" });
        if (res.ok) setPersonalNotes(await res.json());
        setLoadingPersonalNotes(false);
    };

    if (!selected_group) return null;

    // ================= VIEW: EDITOR =================
    if (current_note) {
        return (
            <div className="flex-1 p-4 lg:p-6 h-full overflow-hidden flex flex-col">
                <button onClick={() => setCurrentNote(null)} className="mb-4 px-3 py-1 bg-gray-200 rounded w-fit text-sm hover:bg-gray-300 flex items-center gap-1">← Back to Group</button>
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border h-full flex flex-col gap-4 lg:gap-6 overflow-y-auto">                    <div className="flex gap-6 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-[#4E8DC4] outline-none pb-2" value={current_note.title} onChange={e => setCurrentNote({ ...current_note, title: e.target.value })} placeholder="Title..." />
                    </div>
                    <div className="w-1/4 min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Context)</label>
                        <select
                            value={current_note.tag_id || ""}
                            onChange={e => setCurrentNote({ ...current_note, tag_id: e.target.value ? parseInt(e.target.value) : null })}
                            className={`w-full text-lg border-b-2 pb-2 bg-transparent outline-none cursor-pointer font-semibold
                                    ${current_note.tag_id == 1 ? '' : ''}
                                    ${current_note.tag_id == 2 ? '' : ''}
                                    ${current_note.tag_id == 3 ? '' : ''}
                                `}
                        >
                            <option value="">-- Select --</option>
                            <option value="1">Course</option>
                            <option value="2">Seminar</option>
                            <option value="3">Other</option>
                        </select>
                    </div>
                </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none" value={current_note.description || ''} onChange={e => setCurrentNote({ ...current_note, description: e.target.value })} />
                        </div>
                        <div className="w-full lg:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none" value={current_note.course_date || ''} onChange={e => setCurrentNote({ ...current_note, course_date: e.target.value })} />
                        </div>
                    </div>
                    <textarea
                        className="flex-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4E8DC4] outline-none font-mono text-sm resize-none min-h-[300px]"
                        value={current_note.markdown_content || ''}
                        onChange={e => setCurrentNote({ ...current_note, markdown_content: e.target.value })}
                        placeholder={tagPlaceholders[current_note.tag_id] || "Start typing..."}
                    />
                </div>
            </div>
        );
    }

    // ================= VIEW: LISTA NOTITE =================
    return (
        <div className="flex-1 p-4 lg:p-6 overflow-auto h-full relative ">
            {/* Header */}
            <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">                <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-[#4E8DC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selected_group.name}</h2>
                    <p className="text-xs text-gray-500">{groupMembers.length} Members</p>
                </div>
            </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setShowMemberModal(true)} className="px-3 py-1.5  text-white rounded shadow bg-[#4E8DC4] text-white rounded-lg hover:bg-[#3b78a2] transition flex items-center gap-1">Add Members</button>
                    <button onClick={() => { setShowNoteModal(true); fetchPersonalNotes(); }} className="px-3 py-1.5 text-white rounded shadow bg-[#4E8DC4] text-white rounded-lg hover:bg-[#3b78a2] transition flex items-center gap-1">Add Notes</button>
                    <button className="px-3 py-1.5 text-white rounded shadow bg-[#4E8DC4] rounded-lg hover:bg-[#3b78a2] transition flex items-center gap-1">
        Add Link
    </button>
                </div>
            </div>

            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Shared Notes</h3>

            {loading ? <p className="text-gray-400">Loading...</p> : (
                (!groupNotes || groupNotes.length === 0) ? (
                    <div className="flex flex-col items-center justify-center mt-20 opacity-60 select-none">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-lg font-medium text-gray-400">No notes shared here yet</p>
                        <p className="text-sm text-gray-300">Add a note to start collaborating</p>
                    </div>
                ) : (
                    <ul className="space-y-3 pb-10">
                        {groupNotes.map(note => {
                            if (!note) return null;
                            const noteId = note.id ?? note.note_id;


                            let displayTagName = note.tag_name;
                            if (!displayTagName && note.tag_id) {
                                const tid = parseInt(note.tag_id);
                                if (tid === 1) displayTagName = "Course";
                                else if (tid === 2) displayTagName = "Seminar";
                                else if (tid === 3) displayTagName = "Other";
                            }

                            return (
                                <li key={noteId} onClick={() => handler_note_click(note)} className="bg-white p-4 rounded-lg shadow-sm border border-transparent hover:border-[#4E8DC4] cursor-pointer group transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">

                                                {note.tag_id == 1 ? (
                                                    <span title="Curs">🎓</span>
                                                ) : note.tag_id == 2 ? (
                                                    <span title="Seminar">📝</span>
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                )}
                                                <h3 className="font-semibold text-gray-800">{note.title || 'Untitled'}</h3>
                                            </div>
                                            {note.description && <p className="text-sm text-gray-500 line-clamp-1">{note.description}</p>}
                                        </div>


                                        <button onClick={(e) => handler_delete_note(noteId, e)} className="text-red-500 hover:bg-red-50 p-1 rounded ml-2 transition-colors shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>


                                    <div className="mt-2 pt-2 border-t flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-3">


                                           
                                            
                                            <span className="flex items-center gap-1">
                                                {note.course_date ? (
                                                    <>
                                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <span className="text-gray-700">{note.course_date}</span>
                                                    </>
                                                ) : (
                                                    <span className="italic text-gray-300">No date</span>
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100">
                                                Shared
                                            </span>
                                            <span className="text-gray-400">
                                                {new Date(note.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )
            )}


            {showMemberModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"> 
                <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-xl border">  
                        <button onClick={() => setShowMemberModal(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
                        <h3 className="font-bold mb-4">Add Member</h3>
                        <input className="w-full border p-2 rounded mb-2" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <div className="max-h-40 overflow-auto">
                            {searchResults.map(user => (
                                <div key={user.id || user.user_id} className="flex justify-between p-2 ">
                                    <span>{user.name}</span>
                                    <button onClick={() => handleAddMember(user)} className="text-blue-600 font-bold">Add</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"> 
                <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-xl border">     
                           <button onClick={() => setShowNoteModal(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
                        <h3 className="font-bold mb-4">Share Note</h3>
                        <div className="max-h-60 overflow-auto">
                            {personalNotes.map(n => (
                                <div key={n.id} onClick={() => handleShareNote(n)} className="p-2 border-b cursor-pointer  flex justify-between">
                                    <span>{n.title}</span>
                                    <span className="text-xs text-gray-400">Select</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}