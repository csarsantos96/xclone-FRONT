import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
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
    <div>
      <h2>Login</h2>
      
      <input 
        type="email" 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Senha" 
        onChange={(e) => setSenha(e.target.value)} 
      />
      <button onClick={loginComEmailESenha}>Entrar com Email</button>

      <hr />

      <button onClick={loginComGoogle}>Entrar com Google</button>
    </div>
  );
}

export default Login;
