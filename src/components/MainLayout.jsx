
import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import './MainLayout.css';

function slugify(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function MainLayout() {
  const { firebaseUser } = useAuth(); // Obtém o firebaseUser do hook
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Função para buscar os dados do usuário no backend
    const fetchBackendUser = async () => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Supondo que você tenha um endpoint '/api/accounts/me/' que retorna os dados do usuário logado
          const response = await axios.get('https://csaruto96.pythonanywhere.com/api/accounts/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuário do backend:', error);
        }
      }
    };

    fetchBackendUser();
  }, [firebaseUser]);

  return (
    <div className="app-container">
      {/* Sidebar Esquerda */}
      <aside className="sidebar-left">
        <nav>
          <div className="logo">X</div>
          <ul>
            <li>
              <Link to="/feed">
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/explore">
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Explore</span>
              </Link>
            </li>
            <li>
              {currentUser ? (
                <Link to={`/profile/${slugify(currentUser.username)}`}>
                  <i className="fa-regular fa-user"></i>
                  <span>Profile</span>
                </Link>
              ) : (
                <Link to="/login">
                  <i className="fa-regular fa-user"></i>
                  <span>Login</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Sidebar Direita */}
      <aside className="sidebar-right">
        <div className="sidebar-section">
          <h3>O que está acontecendo</h3>
          <ul>
            <li>#TrendingTopic1</li>
            <li>#TrendingTopic2</li>
            <li>#TrendingTopic3</li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h3>Quem seguir</h3>
          <ul>
            <li>@usuario1</li>
            <li>@usuario2</li>
            <li>@usuario3</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default MainLayout;
