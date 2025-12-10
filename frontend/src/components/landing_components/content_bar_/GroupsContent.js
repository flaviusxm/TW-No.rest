import React, { useEffect, useState } from 'react';

export default function GroupsContent({ selected_group }) {
    const [groupNotes, setGroupNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const groupId = selected_group?.id ?? selected_group?.group_id;

    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const url = `http://localhost:5019/users/search?q=${encodeURIComponent(searchTerm)}`;

                const response = await fetch(url, {
                    credentials: "include",
                    method: 'GET'
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Rezultate gasite:", data);
                    setSearchResults(data);
                } else {
                    console.error("Eroare la search status:", response.status);
                }
            } catch (error) {
                console.error("Eroare retea:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        if (!groupId) return;

        const fetchNotes = async () => {
            setLoading(true);
            try {

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [groupId]);


    if (!selected_group) return null;

    return (
        <div className="flex-1 p-6 overflow-auto h-full relative">
            <div className="mb-6 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-800">{selected_group.name}</h2>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                            onClick={() => console.log("Deschide modala search (urmeaza implementare UI)")}
                        >
                            Add Members
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
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

                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}