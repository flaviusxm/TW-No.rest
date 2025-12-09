import React, { useEffect, useState } from 'react';

export default function GroupsContent({ selected_group }) {
    const [groupNotes, setGroupNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const groupId = selected_group?.id ?? selected_group?.group_id;

    useEffect(() => {
        if (!groupId) return;
        
        const fetchGroupData = async () => {
            setLoading(true);
            try {
                const respNotes = await fetch(`http://localhost:5019/groups/${groupId}`, { credentials: "include" });
                if (respNotes.ok) {
                    const data = await respNotes.json();
                    setGroupNotes(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error loading group data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [groupId]);

    if (!selected_group) return null;

    return (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto h-full">

            <div className="mb-6 border-b pb-4">
                <div className="flex items-center justify-between">
                    
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-blue-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{selected_group.name}</h2>
                            <p className="text-gray-500 text-sm">Shared Group</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                            onClick={() => alert('Add Members clicked')}
                        >
                            Add Members
                        </button>
                        <button 
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-green-700 transition"
                            onClick={() => alert('Add Notes clicked')}
                        >
                            Add Notes
                        </button>

                    </div>

                </div>
            </div>

            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Shared Notes</h3>
            
            {loading ? <p className="text-gray-400">Loading...</p> : (
                groupNotes.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-lg border border-dashed text-gray-400">
                        No notes shared here yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {groupNotes.map(note => (
                            <div key={note.id || note.note_id} className="bg-white p-4 rounded-lg shadow-sm border">
                                <h4 className="font-bold text-gray-800">{note.title}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {note.content || note.description}
                                </p>
                                <div className="mt-2 text-xs text-gray-400">
                                    Shared on: {new Date(note.created_at || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
