// Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword'; // importar o componente
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showForgot, setShowForgot] = useState(false); // controla a tela de "Esqueceu a senha"
  const navigate = useNavigate();

  const loginComEmailESenha = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Logado com email/senha");
      navigate('/feed');
    } catch (error) {
      console.error("Erro no login por email:", error.message);
    }
  };

  const loginComGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logado com Google");
      navigate('/feed');
    } catch (error) {
      console.error("Erro no login com Google:", error.message);
    }
  };

  // Se showForgot = true, renderizamos a tela de esqueci a senha
  if (showForgot) {
    return <ForgotPassword onBack={() => setShowForgot(false)} />;
  }

  // Senão, a tela de login normal
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

      {/* Botão de login com Google */}
      <GoogleLoginButton onGoogleLogin={loginComGoogle} className="button google-button" />

      {/* Link "Esqueceu a senha?" logo abaixo do botão */}
      <p
        style={{ marginTop: '1rem', cursor: 'pointer', color: '#1d9bf0', textDecoration: 'underline' }}
        onClick={() => setShowForgot(true)}
      >
        Esqueceu a senha?
      </p>
    </div>
  );
}

export default Login;
