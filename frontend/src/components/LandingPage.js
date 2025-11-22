import { useState } from 'react';
import rws_app_logo from '../assets/rws_logo.png';

const subjects = ["Math", "Physics", "Chemistry"];
const tags = ["Important", "To Do", "Project"];
const groups = ["Team A", "Team B", "Team C"];

const notesData = {
  Math: [{ id: 1, title: "Algebra Notes", content: "Algebra content..." }],
  Physics: [{ id: 2, title: "Newton Laws", content: "Physics content..." }],
  Chemistry: [{ id: 3, title: "Organic Chemistry", content: "Chem content..." }],
  Important: [{ id: 4, title: "Urgent Note", content: "Important stuff..." }],
  "To Do": [{ id: 5, title: "Task List", content: "Things to do..." }],
  Project: [{ id: 6, title: "Project Plan", content: "Project content..." }],
  "Team A": [{ id: 7, title: "Team A Notes", content: "Team A content..." }],
  "Team B": [{ id: 8, title: "Team B Notes", content: "Team B content..." }],
  "Team C": [{ id: 9, title: "Team C Notes", content: "Team C content..." }],
};

function LandingPage({ user, setUser }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedNotes(notesData[category] || []);
    setSelectedNote(null);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f6f8fb]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-6">
          <img src={rws_app_logo} className="w-24" alt="logo" />
          <input
            type="text"
            placeholder="Search notes..."
            className="px-4 py-2 rounded-lg w-96 border-2 border-[#4E8DC4] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4E8DC4] focus:border-[#4E8DC4]"
          />
        </div>

        {/* Account dropdown */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="px-5 py-2 bg-[#4E8DC4] text-white font-semibold rounded shadow hover:bg-[#3b78a2] transition-colors"
          >
            Account ▼
          </button>

          {accountMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg overflow-hidden animate-slide-down"
              style={{ animation: 'slideDown 0.2s ease-out' }}
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors">
                Account Details
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column */}
        <div className="flex-1 border-r p-4 overflow-auto bg-white">
          <h3 className="font-bold mb-2 text-[#4E8DC4]">Subjects</h3>
          <ul className="mb-4">
            {subjects.map((subj) => (
              <li
                key={subj}
                className="cursor-pointer px-2 py-2 rounded hover:bg-[#E3F0FF] transition-colors"
                onClick={() => handleCategoryClick(subj)}
              >
                {subj}
              </li>
            ))}
          </ul>

          <h3 className="font-bold mb-2 text-[#4E8DC4]">Tags</h3>
          <ul className="mb-4">
            {tags.map((tag) => (
              <li
                key={tag}
                className="cursor-pointer px-2 py-2 rounded hover:bg-[#E3F0FF] transition-colors"
                onClick={() => handleCategoryClick(tag)}
              >
                {tag}
              </li>
            ))}
          </ul>

          <h3 className="font-bold mb-2 text-[#4E8DC4]">Groups</h3>
          <ul>
            {groups.map((group) => (
              <li
                key={group}
                className="cursor-pointer px-2 py-2 rounded hover:bg-[#E3F0FF] transition-colors"
                onClick={() => handleCategoryClick(group)}
              >
                {group}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column */}
        <div className="flex-1 border-r p-4 overflow-auto bg-gray-50">
          <h3 className="font-bold mb-3 text-[#4E8DC4]">Notes</h3>
          {selectedNotes.length === 0 ? (
            <p className="text-gray-500">Select a category to view notes</p>
          ) : (
            <ul>
              {selectedNotes.map((note) => (
                <li
                  key={note.id}
                  className="cursor-pointer px-2 py-2 rounded hover:bg-[#D0E4FF] transition-colors"
                  onClick={() => handleNoteClick(note)}
                >
                  {note.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 p-4 overflow-auto bg-white">
          <h3 className="font-bold mb-3 text-[#4E8DC4]">Note Details</h3>
          {selectedNote ? (
            <div>
              <h4 className="font-semibold text-lg mb-2">{selectedNote.title}</h4>
              <p>{selectedNote.content}</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a note to view details</p>
          )}
        </div>
      </div>

      {/* Tailwind animation */}
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

export default LandingPage;
