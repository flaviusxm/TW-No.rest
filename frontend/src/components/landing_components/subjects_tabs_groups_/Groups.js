import React, { useState, useEffect } from 'react';

export default function Groups({ 
  groups = [], 
  setter_groups, 
  selected_categories, 
  setter_selected_categories 
}) {
  const [show_add_group, setter_show_add_group] = useState(false);
  const [new_group_name, setter_new_group_name] = useState('');
  const [groupCounts, setGroupCounts] = useState({});

 
  useEffect(() => {
    if (!groups || !Array.isArray(groups) || groups.length === 0) return;
    
    let isMounted = true;

    const fetchGroupCounts = async () => {
      const counts = {};
      
      await Promise.all(
        groups.map(async (group) => {
          if (!group) return;
          const gid = group.id ?? group.group_id;
          if (!gid) return;

          try {
            const resp = await fetch(`http://localhost:5019/groups/${gid}/count`, {
              credentials: "include",
            });
            
            if (resp.ok && isMounted) {
              const data = await resp.json();
              counts[gid] = data.notes_count ?? data.members_count ?? 0;
            }
          } catch (err) {
            console.error(`Error fetching count for group ${gid}:`, err);
          }
        })
      );
      
      if (isMounted) {
        setGroupCounts(prev => ({ ...prev, ...counts }));
      }
    };
    
    fetchGroupCounts();

    return () => { isMounted = false; };
  }, [groups]);

  const handler_add_group = async () => {
    if (!new_group_name.trim()) return;

    try {
      const resp = await fetch("http://localhost:5019/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: new_group_name.trim() })
      });

      if (!resp.ok) {
        let errorMsg = `Eroare HTTP: ${resp.status}`;
        try {
          const errData = await resp.json();
          if (errData.err) errorMsg = errData.err;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const created_group = await resp.json();
      console.log('Group created:', created_group);

      if (setter_groups) {
        setter_groups(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [...safePrev, created_group];
        });
      }
      
      const newId = created_group.id ?? created_group.group_id;
      if (newId) {
        setGroupCounts(prev => ({
          ...prev,
          [newId]: 0
        }));
      }
     
      setter_new_group_name('');
      setter_show_add_group(false);

    } catch (err) {
      console.error("Eroare adaugare grup:", err);
      alert(`Nu s-a putut salva grupul: ${err.message}`);
    }
  };

  const handler_save_now = () => {
    handler_add_group();
  };

  const handler_clicked_group = (group) => {
    if (setter_selected_categories) {
      setter_selected_categories(group);
    }
  };

  const handler_delete_group = async (groupId, e) => {
    e.stopPropagation();
    if (!window.confirm("Esti sigur ca vrei sa stergi acest grup?")) return;
    
    try {
      const resp = await fetch(`http://localhost:5019/groups/${groupId}`, {
        method: "DELETE",
        credentials: "include",
        headers:{
          "Content-Type":"application/json"
        }
      });

      if (!resp.ok) {
        throw new Error('Eroare la stergerea grupului');
      }
      
      if (setter_groups) {
        setter_groups(prev => prev.filter(group => {
          const gid = group.id ?? group.group_id;
          return gid !== groupId;
        }));
      }

      setGroupCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[groupId];
        return newCounts;
      });
      
      const selected_id = selected_categories?.id ?? selected_categories?.group_id;
      if (selected_id === groupId && setter_selected_categories) {
        setter_selected_categories(null);
      }
    } catch (err) {
      console.error("Eroare stergere grup:", err);
      alert("Nu s-a putut sterge grupul.");
    }
  };

  const handler_start_adding_group = () => {
    setter_show_add_group(true);
    setter_new_group_name('');
  };

  const handler_cancel_add_group = () => {
    setter_show_add_group(false);
    setter_new_group_name('');
  };

  const safeGroups = Array.isArray(groups) ? groups : [];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-[#4E8DC4]">Groups</h3>
        <button 
          onClick={handler_start_adding_group} 
          className="text-[#4E8DC4] hover:text-[#3b78a2] transition-colors" 
          title="Add new group"
          disabled={show_add_group}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {show_add_group && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <input 
            type="text" 
            value={new_group_name} 
            onChange={(e) => setter_new_group_name(e.target.value)}
            placeholder="Enter group name..."
            onKeyDown={(e) => { if (e.key === 'Enter') handler_save_now(); }}
            className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#4E8DC4]"
            autoFocus 
          />
          <div className="flex gap-2">
            <button 
              onClick={handler_save_now} 
              className="flex-1 bg-[#4E8DC4] text-white py-1 px-3 rounded hover:bg-[#3b78a2] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!new_group_name.trim()}
            >
              Save Now
            </button>
            <button 
              onClick={handler_cancel_add_group}
              className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-1">
        {safeGroups.length === 0 ? (
          <li className="text-gray-500 text-sm py-2 text-center">No groups yet</li>
        ) : (
          safeGroups.map((group) => {
            if (!group) return null;

            const gid = group.id ?? group.group_id;
            const count = groupCounts[gid] ?? 0;
            const isSelected = (selected_categories?.id ?? selected_categories?.group_id) === gid;
            
            return (
              <li
                key={gid}
                className={`
                  cursor-pointer px-3 py-2 rounded transition-colors group flex justify-between items-center
                  ${isSelected
                    ? 'bg-[#4E8DC4] text-white hover:bg-[#E3F0FF] hover:text-gray-900'
                    : 'hover:bg-[#E3F0FF]'
                  }
                `}
                onClick={() => handler_clicked_group({ ...group, id: gid, type: 'group' })}
              >
                <span className="flex-1 truncate">{group.name}</span>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected ? 'bg-blue-400 text-white' : (count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600')
                  }`}>
                    {count}
                  </span>

                  <button
                    onClick={(e) => handler_delete_group(gid, e)}
                    className={`
                      p-1 rounded opacity-100 transition-colors
                      ${isSelected
                        ? 'text-white group-hover:text-red-500 hover:bg-red-100'
                        : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      }
                    `}
                    title="Delete group"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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