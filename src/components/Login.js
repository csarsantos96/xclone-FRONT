import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples de campos vazios
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      
      // Armazenando o token e refresh token no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Redirecionando o usuário para a página do feed
      navigate('/feed');
    } catch (err) {
      // Tratando erro de login
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Credenciais inválidas. Verifique usuário e senha.');
      } else {
        setError('Ocorreu um erro inesperado.');
      }
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Entrar</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <label className="label" htmlFor="username">Usuário</label>
        <input
          className="input"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="label" htmlFor="password">Senha</label>
        <input
          className="input"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="button">Entrar</button>
      </form>

      <p className="signup">
        Não tem uma conta? <a href="/signup" className="link">Crie agora</a>
      </p>
    </div>
  );
};

export default Login;
