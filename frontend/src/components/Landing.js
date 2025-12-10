import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import rws_app_logo from '../assets/rws_logo.png';
import SubjectsTagsGroupsBar from './landing_components/SubjectsGroupsBar';
import ContentBar from './landing_components/ContentBar';

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

export default function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [groups, setter_groups] = useState([]);
  const [subjects, setter_subjects] = useState([]);

  // states pentru filtre search
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    scopeSubjects: true,
    scopeGroups: true,
    onlyWithTags: false,
    onlyShared: false
  });

  const [selected_categories, setter_selected_categories] = useState(null);
  const [is_achievements, setter_is_achievements] = useState(false);
  const [selected_notes, setter_selected_notes] = useState([]);
  const [selected_note, setter_selected_note] = useState(null);
  const [account_menu_open, setter_account_menu_open] = useState(false);
  const [show_note_user, setter_show_note_user] = useState(false);

  const handleSetSelectedCategories = (val) => {
    setter_selected_categories(val);
    setter_is_achievements(false);
  };

  const navigate = useNavigate();

  //  pentru schimbarea filtrelor
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:5019/auth/status", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        } else {
          navigate("/");
        }
      } catch (e) {
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const fetch_subjects = async () => {
      try {
        const resp = await fetch("http://localhost:5019/subjects", {
          credentials: "include",
        });

        if (resp.ok) {
          const data = await resp.json();
          console.log('Subjects loaded:', data);
          setter_subjects(data);
        } else if (resp.status === 401) {
          navigate('/');
        }
      } catch (err) {
        console.error("Error loading subjects:", err);
      }
    };

    fetch_subjects();
  }, [navigate]);

  useEffect(() => {
    const fetch_groups = async () => {
      try {
        const resp = await fetch("http://localhost:5019/groups", {
          credentials: "include",
        });

        if (resp.ok) {
          const data = await resp.json();
          console.log('Groups loaded:', data);
          setter_groups(data);
        }
      } catch (err) {
        console.error("Error loading groups:", err);
      }
    };
    fetch_groups();
  }, [navigate]);

  const handler_logout = async () => {
    try {
      await fetch("http://localhost:5019/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const user_initial = getInitial(user?.name || user?.email);
  const avatar_color = getColorFromInitial(user_initial);

  return (
    <div className="h-screen w-screen flex flex-row bg-[#f6f8fb] overflow-hidden">

      {/*sidebar */}
      <div className="w-[20%] h-full flex flex-col border-r bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out relative z-30 shadow-md">
        <div className="w-full h-40 border-b border-gray-100 overflow-hidden">
          <img src={rws_app_logo} className="w-full h-full object-cover scale-75" alt="logo" />
        </div>

        <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
          <SubjectsTagsGroupsBar
            subjects={subjects}
            setter_subjects={setter_subjects}
            groups={groups}
            setter_groups={setter_groups}
            selected_categories={selected_categories}
            setter_selected_categories={handleSetSelectedCategories}
            setter_selected_note={setter_selected_note}
            setter_show_note_user={setter_show_note_user}
          />
        </div>
      </div>

      {/* Header + Content */}
      <div className="w-[80%] h-full flex flex-col relative">

        {/* HEADER */}
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm z-20 h-20">


          <div className="w-10"></div>

          {/* SEARCH + FILTER SECTION */}
          <div className="flex justify-center relative">
            <div className="relative flex items-center w-96">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full px-4 py-2 pr-10 rounded-lg shadow-xl 
                              focus:outline-none focus:ring-2 focus:ring-[#4E8DC4] focus:border-[#4E8DC4]"
              />

              {/* Filter Icon Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-2 p-1 rounded-md transition-colors ${showFilters ? 'bg-blue-100 text-[#4E8DC4]' : 'text-gray-400 hover:text-[#4E8DC4]'
                  }`}
                title="Advanced Filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
              </button>
            </div>

            {/* FILTER PANEL */}
            {showFilters && (
              <div className="absolute top-12 left-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700 text-sm">Advanced Filters</h3>
                  <button
                    onClick={() => setFilters({
                      dateStart: '', dateEnd: '', scopeSubjects: true, scopeGroups: true, onlyWithTags: false, onlyShared: false
                    })}
                    className="text-xs text-[#4E8DC4] hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Course Date Range */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Course Date</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="text-xs text-gray-400 block mb-1">From</span>
                      <input
                        type="date"
                        name="dateStart"
                        value={filters.dateStart}
                        onChange={handleFilterChange}
                        className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:border-[#4E8DC4]"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-400 block mb-1">To</span>
                      <input
                        type="date"
                        name="dateEnd"
                        value={filters.dateEnd}
                        onChange={handleFilterChange}
                        className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:border-[#4E8DC4]"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-3 border-gray-100" />

                {/* Search Scope */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Search In</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="scopeSubjects"
                        checked={filters.scopeSubjects}
                        onChange={handleFilterChange}
                        className="accent-[#4E8DC4] w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">Subjects</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="scopeGroups"
                        checked={filters.scopeGroups}
                        onChange={handleFilterChange}
                        className="accent-[#4E8DC4] w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">Groups</span>
                    </label>
                  </div>
                </div>

                <hr className="my-3 border-gray-100" />


              </div>
            )}
          </div>

          {/* USER MENU */}
          <div className="flex justify-end relative">
            <button
              onClick={() => setter_account_menu_open(!account_menu_open)}
              className="flex items-center gap-2 px-3 py-2 bg-white/30 text-black rounded-lg shadow-xl hover:bg-white/50 transition border border-gray-100"
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
                <button
                  onClick={() => {
                    setter_selected_categories(null);
                    setter_is_achievements(true);
                    setter_account_menu_open(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 border-b">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Achievements
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

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-auto bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out">
          <ContentBar
            selected_category={selected_categories}
            setter_selected_note={setter_selected_note}
            setter_subjects={setter_subjects}
            setter_selected_categories={handleSetSelectedCategories}
            is_achievements={is_achievements}
          />
        </div>

      </div>

      <style>
        {`
          @keyframes slideDown {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #e5e7eb;
            border-radius: 20px;
          }
        `}
      </style>
    </div>
  );
}