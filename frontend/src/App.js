import { useState, useEffect } from 'react';
import Login from './components/Login';
import LandingPage from './components/LandingPage';

function App() {
  /*const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);*/

  const [user, setUser] = useState({ email: "test@example.com" });
const [loading, setLoading] = useState(false);


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/status", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return user ? (
    <LandingPage user={user} setUser={setUser} />
  ) : (
    <Login setUser={setUser} />
  );
}

export default App;
