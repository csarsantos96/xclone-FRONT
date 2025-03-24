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
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', {
        username,
        password,
      });
      // Exemplo: se o backend retornar algo como { token: "abc123" }
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Verifique usuário e senha.');
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
        Não tem uma conta? <a href="/" className="link">Crie agora</a>
      </p>
    </div>
  );
};

export default Login;
