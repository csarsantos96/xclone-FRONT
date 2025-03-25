import React, { useEffect } from 'react'; // <-- Importa useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedPage from './components/FeedPage';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUpPage from './components/SingUpPage'; // Corrigido: 'SingUpPage' já está certo se for esse nome mesmo

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário logado:", user);
      } else {
        console.log("Usuário não autenticado.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
