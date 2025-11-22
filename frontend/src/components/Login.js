import rws_app_logo from '../assets/rws_logo.png';
import { motion } from 'framer-motion';

function Login({ setUser }) {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9fafb] via-[#eef3f8] to-[#e6edf5]">
      <motion.div className="relative z-10 bg-white/90 backdrop-blur-xl border border-[#4E8DC4]/40 rounded-3xl shadow-2xl flex overflow-hidden w-11/12 max-w-5xl">
        {/* Left panel (logo și text) */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center p-10 relative" style={{ backgroundColor: "#76AAE0", color: "#ffffff" }}>
          <motion.img src={rws_app_logo} alt="logo" className="w-36 h-36 mb-6" />
          <h1 className="text-2xl font-extrabold text-center mb-2">RWS Productivity</h1>
          <p className="text-sm text-center opacity-90 max-w-xs">Stay organized. Stay focused. Achieve more with ease.</p>
        </div>

        {/* Right panel (buton login) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center text-center">
          <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4E8DC4] via-[#76AAE0] to-[#FEDB59]">
            Welcome Back!
          </h2>
          <button onClick={handleGoogleLogin} className="mx-auto flex items-center justify-center gap-3 bg-white border rounded-full px-6 py-3 shadow-md hover:shadow-lg transition">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5"/>
            <span className="text-[#4e8dc4] font-medium">Sign in with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
