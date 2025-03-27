import React, { useState } from 'react';
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 
import './SignUpPage.css'; 

function SignUpPage() {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const navigate = useNavigate();

const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    // Cria o usuário no Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário criado no Firebase:", userCredential.user);

    const firebaseUid = userCredential.user.uid;

    // Envia os dados para o backend para inserir no PostgreSQL
    const response = await fetch('http://localhost:8000/api/accounts/createUser/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        firebaseUid,
        username,
        email
      })
    });
    

    const data = await response.json();
    console.log('Resposta do backend:', data);

    if (data.detail && data.detail.includes("Verifique seu e-mail")) {
        // Aqui, podemos redirecionar o usuário para uma página de instrução
        // ou apenas exibir uma mensagem informando que o e-mail foi enviado
        navigate('/check-your-email');
    } else {
        // Caso haja algum erro, você pode exibir uma mensagem apropriada
        alert('Erro ao criar conta. Tente novamente.');
    }
  } catch (error) {
      console.error("Erro no cadastro:", error.message);
      if (error.code === 'auth/email-already-in-use'){
        alert('Este e-mail já está registrado. Tente usar outro.');
      }
  }
};

return (
    <div className="signup-container">
    <h1 className="signup-heading">Criar sua conta</h1>

    <form className="signup-form" onSubmit={handleSignUp}>
        <div className="form-group">
        <label htmlFor="username">Nome de usuário</label>
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
        <label htmlFor="email">E-mail</label>
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
        <label htmlFor="password">Senha</label>
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
        Criar conta
        </button>
    </form>

    <p className="login-redirect">
        Já tem uma conta? <a href="/login" className="login-link">Entrar</a>
    </p>
    </div>
);
}

export default SignUpPage;
