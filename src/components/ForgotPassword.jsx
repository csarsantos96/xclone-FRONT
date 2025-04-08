// ForgotPassword.jsx
import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPassword.css';

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMsg('Verifique seu e-mail para redefinir a senha!');
    } catch (err) {
      console.error('Erro ao enviar e-mail de redefinição:', err);
      setError('Não foi possível enviar o e-mail de redefinição. Verifique se o e-mail está correto.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <label htmlFor="fp-email">Digite seu e-mail:</label>
        <input
          id="fp-email"
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="forgot-input"
        />
        <button type="submit" className="forgot-button">Enviar Link</button>
      </form>
      {msg && <p className="forgot-success">{msg}</p>}
      {error && <p className="forgot-error">{error}</p>}

      {/* Botão ou link para voltar ao login */}
      <p className="forgot-back" onClick={onBack}>Voltar para o Login</p>
    </div>
  );
}

export default ForgotPassword;
