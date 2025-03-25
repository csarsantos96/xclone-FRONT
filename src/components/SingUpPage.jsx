import React, { useState } from 'react';
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import './SignUpPage.css'; 

function SignUpPage() {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Cria o usuário no Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário criado no Firebase:", userCredential.user);
    
    const firebaseUid = userCredential.user.uid;
    
      // Opcional: atualizar o displayName do usuário no Firebase se desejar
      // await updateProfile(userCredential.user, { displayName: username });
    
      // Agora, envia os dados para o backend para inserir no PostgreSQL
    const response = await fetch('http://localhost:8000/api/accounts/createUser/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebaseUid,    // ID do usuário gerado pelo Firebase
          username,       // Nome de usuário que o usuário informou
          email           // Email do usuário
        })
    });
    
    const data = await response.json();
    console.log('Resposta do backend:', data);
    
      // Aqui você pode redirecionar o usuário, exibir uma mensagem, etc.
    
    } catch (error) {
    console.error("Erro no cadastro:", error);
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
