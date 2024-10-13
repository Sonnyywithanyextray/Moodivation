import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { AnimatePresence } from 'framer-motion';
import Login from './App/Authentication/Login';
import Register from './App/Authentication/Register';
import Dashboard from './App/dashboard';
import Profile from './App/profile';
import Callback from './components/callback';
import JournalApp from './App/Journal';
function App() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', (error as Error).message);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route path="/callback" element={<Callback/>} />
         <Route path="/journal" element={<JournalApp/>} />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;