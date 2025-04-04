// ExplorePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './ExplorePage.css';

function ExplorePage() {
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [firebaseUser, setFirebaseUser] = useState(null);

  // Monitora a autenticação do Firebase
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
    });
    return () => unsubscribe();
}, []);

  // Função para buscar usuários
const handleSearch = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;

    try {
    const token = await firebaseUser.getIdToken();
      // Exemplo de endpoint para busca de usuários: ajuste conforme sua API
    const response = await axios.get(
        `http://localhost:8000/api/users/search/?q=${query}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
      // Pode ser que a resposta venha em response.data.results ou diretamente em response.data
    setResults(response.data.results || response.data);
    } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    }
};

return (
    <div className="explore-container">
    <h2>Encontrar Usuários</h2>
    <form onSubmit={handleSearch} className="search-form">
        <input
        type="text"
        placeholder="Digite o nome ou username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
    </form>
    <div className="results">
        {results.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
        ) : (
        results.map((user) => (
            <div key={user.id} className="user-card">
            <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="user-avatar"
            />
            <Link to={`/profile/${user.username}`}>
                {user.displayName || user.username}
            </Link>
            </div>
        ))
        )}
    </div>
    </div>
);
}

export default ExplorePage;
