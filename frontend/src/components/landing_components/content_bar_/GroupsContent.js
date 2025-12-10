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
                    <div className="flex items-center gap-3">
    <svg className="w-8 h-8 text-[#4E8DC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <h2 className="text-2xl font-bold text-gray-800">{selected_group.name}</h2>
</div>
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
                    <div className="flex flex-col items-center justify-center mt-20 opacity-60 select-none">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-400">No notes shared here yet</p>
                        <p className="text-sm text-gray-300">Add a note to start collaborating</p>
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