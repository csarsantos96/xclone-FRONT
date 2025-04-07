import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate(); // Hook para redirecionar

  const loginComEmailESenha = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Logado com email/senha");
      navigate('/feed'); // Redireciona para o feed
    } catch (error) {
      console.error("Erro no login por email:", error.message);
    }
  };

  const loginComGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logado com Google");
      navigate('/feed'); // Redireciona para o feed
    } catch (error) {
      console.error("Erro no login com Google:", error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>

      <div className="form">
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label" htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          placeholder="Senha"
          className="input"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={loginComEmailESenha} className="button">
          Entrar com Email
        </button>
      </div>

      {/* Componente de login com Google */}
      <GoogleLoginButton onGoogleLogin={loginComGoogle} className="button google-button"/>
    </div>
  );
}

export default Login;
