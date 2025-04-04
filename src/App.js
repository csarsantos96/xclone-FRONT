// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUpPage from './components/SingUpPage';
import MainLayout from './components/MainLayout';
import FeedPage from './components/FeedPage';
import ExplorePage from './components/ExplorePage';
import ProfilePage from './components/ProfilePage';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  // Correto: tanto o valor quanto a função são definidos
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        user.getIdToken().then((token) => console.log("Token:", token));
      } else {
        console.log("Usuário não autenticado.");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
