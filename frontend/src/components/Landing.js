import { useState, useEffect } from 'react';
import rws_app_logo from '../assets/rws_logo.png';
import SubjectsTagsGroupsBar from './landing_components/SubjectsTagsGroupsBar';
import ContentBar from './landing_components/ContentBar';
import DetailsBar from './landing_components/DetailsBar';

const getInitial = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const getColorFromInitial = (initial) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-lime-500', 'bg-violet-500'
  ];
  
  const charCode = initial.charCodeAt(0);
  const colorIndex = charCode % colors.length;
  return colors[colorIndex];
};

export default function Landing({ user, setUser }) {
  const [subjects, setter_subjects] = useState([]);
  const [selected_categories, setter_selected_categories] = useState(null);
  const [selected_notes, setter_selected_notes] = useState([]);
  const [selected_note, setter_selected_note] = useState(null);
  const [account_menu_open, setter_account_menu_open] = useState(false);
  const [show_note_user, setter_show_note_user] = useState(false);

  useEffect(() => {
    const fetch_subjects = async () => {
      try {
        const resp = await fetch("http://localhost:5000/subjects", {
          credentials: "include"
        });
        
        if (resp.ok) {
          const data = await resp.json();
          console.log('Subjects loaded:', data);
          setter_subjects(data);
        }
      } catch (err) {
        console.error("Error loading subjects:", err);
      }
    };

    if (user) {
      fetch_subjects();
    }
  }, [user]);

  const handler_note_click = (note) => {
    setter_selected_note(note);
  };

  const handler_logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const user_initial = getInitial(user?.name || user?.email);
  const avatar_color = getColorFromInitial(user_initial);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f6f8fb]">
      <header className="flex items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-6 w-1/3">
          <img src={rws_app_logo} className="w-24 shadow-xl rounded-lg" alt="logo" />
        </div>

        <div className="flex justify-center w-1/3">
          <input
            type="text"
            placeholder="Search notes..."
            className="px-4 py-2 rounded-lg w-96 shadow-xl 
                       focus:outline-none focus:ring-2 focus:ring-[#4E8DC4] focus:border-[#4E8DC4]"
          />
        </div>

        <div className="flex justify-end w-1/3 relative">
          <button
            onClick={() => setter_account_menu_open(!account_menu_open)}
            className="flex items-center gap-2 px-3 py-2 bg-white/30 text-black rounded-lg shadow-xl hover:bg-white/50 transition"
          >
            {user?.pictureUrl ? (
              <img 
                src={user.pictureUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${avatar_color}`}>
                {user_initial}
              </div>
            )}

            <span className="font-medium">
              {user?.name?.split(' ')[0] || user_initial}
            </span>
          </button>

          {account_menu_open && (
            <div className="absolute right-0 mt-12 w-56 bg-white border rounded-lg shadow-xl z-50">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 border-b">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Details
              </button>

              <button
                onClick={handler_logout}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="basis-[20%] max-w-[20%] border-r p-4 overflow-auto bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out">
          <SubjectsTagsGroupsBar
            subjects={subjects}
            setter_subjects={setter_subjects}
            selected_categories={selected_categories}
            setter_selected_categories={setter_selected_categories}
            setter_selected_note={setter_selected_note}
            setter_show_note_user={setter_show_note_user}
          />
        </div>

        <div className="basis-[60%] max-w-[60%] p-4 overflow-auto bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out">
          <ContentBar 
            selected_category={selected_categories}
            setter_selected_note={setter_selected_note}
            setter_subjects={setter_subjects}
            setter_selected_categories={setter_selected_categories}
          />
        </div>

        <div className="basis-[20%] max-w-[20%] border-l p-4 overflow-auto bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out">
          <DetailsBar selected_note={selected_note} />
        </div>
      </div>

      <style>
        {`
          @keyframes slideDown {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}