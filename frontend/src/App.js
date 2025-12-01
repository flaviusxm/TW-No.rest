import rws_app_logo from './assets/rws_logo.png';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import Landing from './components/Landing';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setter_subjects] = useState([]);
  const [selected_categories, setter_selected_categories] = useState(null);
  const [selected_note, setter_selected_note] = useState(null);
  const [show_note_user, setter_show_note_user] = useState(false);
  const navigate=useNavigate();
  // check user status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/status", {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('auth/status data =', data);
          if (data?.user) {
            setUser(data.user);
            navigate('/landing');
          } else if (data) {
            setUser(data);
            navigate('/landing');
          }
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#4E8DC4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
if (user) {
  return <Landing user={user} setUser={setUser} />;
}
 

  // Login UI
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9fafb] via-[#eef3f8] to-[#e6edf5] text-[#1f2937]">
      {/* back lights */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[20rem] h-[20rem] bg-[#FEDB59]/70 rounded-full blur-[100px]"
          animate={{
            x: ['0%', '60%', '-40%', '0%'],
            y: ['0%', '-30%', '40%', '0%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '10%', left: '5%' }}
        />
        <motion.div
          className="absolute w-[22rem] h-[22rem] bg-[#4E8DC4]/60 rounded-full blur-[110px]"
          animate={{
            x: ['0%', '-50%', '60%', '0%'],
            y: ['0%', '40%', '-30%', '0%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '10%', right: '8%' }}
        />
      </div>

      {/* main */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 bg-white/90 backdrop-blur-xl border border-[#4E8DC4]/40 rounded-3xl shadow-2xl flex overflow-hidden w-11/12 max-w-5xl"
        style={{
          boxShadow: `
            -35px 0 70px -10px rgba(78,141,196,0.55),
            35px 0 70px -10px rgba(254,219,89,0.55)
          `,
        }}
      >
        {/* left-panel */}
        <div
          className="w-1/2 hidden md:flex flex-col items-center justify-center p-10 relative"
          style={{ backgroundColor: "#76AAE0", color: "#ffffff" }}
        >
          <motion.div
            className="absolute w-56 h-56 rounded-full blur-[80px] bg-[#FEDB59]/40"
            animate={{ x: [0, 15, -15, 0], y: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-[90px] bg-[#4E8DC4]/30"
            animate={{ x: [0, -10, 10, 0], y: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* logo */}
          <motion.img
            src={rws_app_logo}
            alt="logo"
            className="w-36 h-36 object-contain relative z-10 mb-6"
            style={{
              filter: `
                drop-shadow(10px 0 25px rgba(255,255,255,0.95))
                drop-shadow(0 0 35px rgba(255,255,255,0.9))
                drop-shadow(-5px 0 15px rgba(255,255,255,0.7))
              `,
            }}
            initial={{ rotate: -15, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 1.8,
              ease: "easeOut",
              type: "spring",
              stiffness: 70,
              damping: 10,
            }}
          />

          <h1 className="text-2xl font-extrabold text-center mb-2 drop-shadow-sm">
            RWS Productivity
          </h1>
          <p className="text-sm font-medium text-center opacity-90 max-w-xs">
            Stay organized. Stay focused. Achieve more with ease.
          </p>
        </div>

        {/* right-panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2
            className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-[#4E8DC4] via-[#76AAE0] to-[#FEDB59] bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Welcome Back!
          </h2>

          <p className="text-center text-[#4E8DC4]/80 mb-6">
            Sign in using your institutional email address
          </p>

          <button
            onClick={handleGoogleLogin}
            className="mx-auto flex items-center justify-center gap-3 bg-white border border-[#ccc] rounded-full px-6 py-3 shadow-md hover:shadow-lg transition hover:scale-105"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-[#4e8dc4] font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;