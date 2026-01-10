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
const [mobile_layout,set_mobile_layout]=useState(false);
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
    set_mobile_layout(false);
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
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#f6f8fb] overflow-hidden relative">
{
  mobile_layout && (
    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
    onClick={()=>set_mobile_layout(false)}
    />
  )
}
  <div className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-[20%] h-full flex flex-col border-r bg-white shadow-xl transition-transform duration-300 ease-in-out ${mobile_layout ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:block hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white`}>
        
        {/* Logo Area */}
        <div className="w-full h-[7.5rem] border-b shadow-md flex items-center justify-center relative bg-white">
          
          <button 
            onClick={() => set_mobile_layout(false)}
            className="absolute top-4 right-4 p-2 lg:hidden text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img src={rws_app_logo} className="h-[60%] lg:h-[90%] object-contain" alt="logo" />
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
      <div className="w-full lg:w-[80%] h-full flex flex-col relative">

        {/* HEADER */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white shadow-md z-20 h-[5rem] lg:h-[7.5rem]">

          <div className="flex items-center">
            <button 
              onClick={() => set_mobile_layout(true)}
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
      
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
                 <svg 
                    className="w-5 h-5 text-yellow-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a7 7 0 007-7V4H5v4a7 7 0 007 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 22h12" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4H4.5a2.5 2.5 0 000 5H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 4h.5a2.5 2.5 0 010 5H19" />
                  </svg>
                  <span className="text-gray-700">Achievements</span>
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
        <div className="flex-1 p-2 lg:p-4 shadow-sm overflow-auto bg-white hover:bg-gradient-to-t hover:from-blue-50 hover:via-blue-25 hover:to-white transition-all duration-2000 ease-in-out">
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