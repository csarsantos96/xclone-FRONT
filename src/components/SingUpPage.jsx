import React, { useState } from 'react';
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton'; //
import './SignUpPage.css';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState(''); // opcional, se quiser atualizar o display name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fluxo de cadastro com e-mail/senha
  const handleSignUpEmail = async (e) => {
    e.preventDefault();
    try {
      // Cria o usuário no Firebase com e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuário criado no Firebase:", userCredential.user);

      // Atualiza o display name, se desejar
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      const firebaseUid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      // Envia os dados para o backend para inserir no PostgreSQL
      const response = await fetch('https://csaruto96.pythonanywhere.com/api/accounts/createUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUid,
          username,
          
          email,
        })
      });

      const data = await response.json();
      console.log('Resposta do backend:', data);

      if (data.detail && data.detail.includes("Verifique seu e-mail")) {
        navigate('/check-your-email');
      } else {
        navigate('/feed');
      }
    } catch (err) {
      console.error("Erro no cadastro com e-mail:", err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está registrado. Tente usar outro.');
      } else {
        setError(err.message);
      }
    }
  };

  // Fluxo de cadastro/login com Google
  const handleSignUpGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", userCredential.user);

      const firebaseUid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      // Envia os dados para o backend
      const response = await fetch('https://csaruto96.pythonanywhere.com/api/accounts/createUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUid,
          username: userCredential.user.displayName, // ou peça para o usuário definir um username adicional, se necessário
          email: userCredential.user.email,
        })
      });

      const data = await response.json();
      console.log('Resposta do backend:', data);

      navigate('/feed');
    } catch (err) {
      console.error("Erro no cadastro/login com Google:", err.message);
      setError('Erro ao autenticar com o Google. Tente novamente.');
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-heading">Criar sua conta</h1>

      {error && <p className="error-msg">{error}</p>}

      <form className="signup-form" onSubmit={handleSignUpEmail}>
        <div className="form-group">
          <label htmlFor="name">Nome (opcional):</label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nome de usuário (comece com @):</label>
          <input
            id="username"
            type="text"
            placeholder="Seu nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-btn">
          Criar conta com E-mail
        </button>
      </form>

      <br />

      {/* Botão para autenticação via Google */}
      <GoogleLoginButton onClick={handleSignUpGoogle} />

      <p className="login-redirect">
        Já tem uma conta? <a href="/login" className="login-link">Entrar</a>
      </p>
    </div>
  );
}

export default SignUpPage;
