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
      // Corrige a URL para bater com o endpoint do backend
      const response = await axios.get(
        `https://csaruto96.pythonanywhere.com/api/accounts/search/?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Ajusta conforme sua resposta (se é response.data.results ou response.data)
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
                src={user.profile_image || '/default-avatar.png'}
                alt={user.username}
                className="user-avatar"
              />
              <Link to={`/profile/${user.username}`}>
                {user.name || user.username}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
