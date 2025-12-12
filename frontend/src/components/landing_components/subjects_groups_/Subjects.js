import React, { useState, useEffect } from 'react';

export default function Subjects({
  subjects = [],
  setter_subjects,
  selected_categories,
  setter_selected_categories,
  setter_sel,
  setSelectedNote,
  setter_show_note_user
}) {
  const [show_add_subject, setter_show_add_subject] = useState(false);
  const [new_subject_name, setter_new_subject_name] = useState('');
  const [subjectCounts, setSubjectCounts] = useState({});

  // Fetch counts pentru subiecte
  useEffect(() => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) return;

    let isMounted = true;

    const fetchSubjectCounts = async () => {
      const counts = {};

      await Promise.all(
        subjects.map(async (subject) => {
          if (!subject) return;
          const sid = subject.id ?? subject.subject_id;
          if (!sid) return;

          try {
            const resp = await fetch(`http://localhost:5019/subjects/${sid}/count`, {
              credentials: "include",
            });

            if (resp.ok && isMounted) {
              const data = await resp.json();
              counts[sid] = data.notes_count;
            }
          } catch (err) {
            console.error(`Error fetching count for subject ${sid}:`, err);
            // Nu setam 0 explicit aici pentru a nu suprascrie date vechi in caz de eroare temporara
          }
        })
      );

      if (isMounted) {
        setSubjectCounts(prev => ({ ...prev, ...counts }));
      }
    };

    fetchSubjectCounts();

    return () => { isMounted = false; };
  }, [subjects]);

  const handler_add_subject = async () => {
    if (!new_subject_name.trim()) return;

    try {
      const resp = await fetch("http://localhost:5019/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: new_subject_name.trim() })
      });

      if (!resp.ok) {
        // Incercam sa extragem eroarea JSON, altfel folosim status text
        let errorMsg = `Eroare HTTP: ${resp.status}`;
        try {
          const errData = await resp.json();
          if (errData.err) errorMsg = errData.err;
        } catch (e) {
          // Response not JSON
        }
        throw new Error(errorMsg);
      }

      const created_subject = await resp.json();
      console.log('Subject created:', created_subject);

      // 1. Actualizam lista de subiecte
      if (setter_subjects) {
        setter_subjects(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safePrev, created_subject];
        });
      } else {
        console.warn("setter_subjects lipseste! UI-ul nu se va actualiza.");
      }

      // 2. Initializam contorul pentru noul subiect (0 note)
      const newId = created_subject.id ?? created_subject.subject_id;
      if (newId) {
        setSubjectCounts(prev => ({
          ...prev,
          [newId]: 0
        }));
      }

      // 3. Resetam UI-ul
      setter_new_subject_name('');
      setter_show_add_subject(false);

    } catch (err) {
      console.error("Eroare adaugare subiect:", err);
      alert(`Nu s-a putut salva subiectul: ${err.message}`);
    }
  };

  const handler_save_now = () => {
    handler_add_subject();
  };

  const handler_clicked_subject = (subject) => {
    if (setter_selected_categories) {
      setter_selected_categories(subject);
    }
  };

  const handler_delete_subject = async (subjectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Esti sigur ca vrei sa stergi acest subiect?")) return;

    try {
      const resp = await fetch(`http://localhost:5019/subjects/${subjectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!resp.ok) {
        throw new Error('Eroare la stergerea subiectului');
      }

      if (setter_subjects) {
        setter_subjects(prev => prev.filter(subject => {
          const sid = subject.id ?? subject.subject_id;
          return sid !== subjectId;
        }));
      }

      setSubjectCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[subjectId];
        return newCounts;
      });

      const selected_id = selected_categories?.id ?? selected_categories?.subject_id;
      if (selected_id === subjectId && setter_selected_categories) {
        setter_selected_categories(null);
      }
    } catch (err) {
      console.error("Eroare stergere subiect:", err);
      alert("Nu s-a putut sterge subiectul.");
    }
  };

  const handler_start_adding_subject = () => {
    setter_show_add_subject(true);
    setter_new_subject_name('');
  };

  const handler_cancel_add_subject = () => {
    setter_show_add_subject(false);
    setter_new_subject_name('');
  };

  // Safe subjects array pentru randare
  const safeSubjects = Array.isArray(subjects) ? subjects : [];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-[#4E8DC4]">Subjects</h3>
        <button
          onClick={handler_start_adding_subject}
          className="text-[#4E8DC4] hover:text-[#3b78a2] transition-colors"
          title="Add new subject"
          disabled={show_add_subject}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {show_add_subject && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <input
            type="text"
            value={new_subject_name}
            onChange={(e) => setter_new_subject_name(e.target.value)}
            placeholder="Enter subject name..."
            onKeyDown={(e) => { if (e.key === 'Enter') handler_save_now(); }}
            className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handler_save_now}
              className="flex-1 bg-[#4E8DC4] text-white py-1 px-3 rounded hover:bg-[#3b78a2] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!new_subject_name.trim()}
            >
              Save Now
            </button>
            <button
              onClick={handler_cancel_add_subject}
              className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-1">
        {safeSubjects.length === 0 ? (
          <li className="text-gray-500 text-sm py-2 text-center">No subjects yet</li>
        ) : (
          safeSubjects.map((subject) => {
            if (!subject) return null;

            const sid = subject.id ?? subject.subject_id;
            const noteCount = subjectCounts[sid] ?? subject.notes_count ?? 0;
            const isSelected = (selected_categories?.id ?? selected_categories?.subject_id) === sid;

            return (
              <li
                key={sid}
                className={`
                  cursor-pointer px-3 py-2 rounded transition-colors group flex justify-between items-center
                  ${isSelected
                      ? 'bg-[#4E8DC4] text-white hover:bg-[#E3F0FF] hover:text-gray-900'
                      : 'hover:bg-[#E3F0FF]'
                  }
              `}
                onClick={() => handler_clicked_subject({ ...subject, id: sid })}
              >
                <span className="flex-1 truncate">{subject.name}</span>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-blue-400 text-white' : (noteCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600')
                    }`}>
                    {noteCount}
                  </span>

                  <button
                    onClick={(e) => handler_delete_subject(sid, e)}
                    className={`
    p-1 rounded transition-colors
    ${isSelected
                        ? 'text-white group-hover:text-red-500 hover:!bg-red-50 hover:!text-red-600'
                        : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                      }
  `}
                    title="Delete subject"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}