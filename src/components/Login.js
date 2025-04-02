import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import GoogleLoginButton from './GoogleLoginButton';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const loginComEmailESenha = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Logado com email/senha");
    } catch (error) {
      console.error("Erro no login por email:", error.message);
    }
  };

  const loginComGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logado com Google");
    } catch (error) {
      console.error("Erro no login com Google:", error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>

      {/* Se desejar exibir mensagens de erro, adicione aqui */}
      
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
      <GoogleLoginButton onGoogleLogin={loginComGoogle} />
    </div>
  );
}

export default Login;
