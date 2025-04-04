// src/components/MainLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Esse hook deve retornar o firebaseUser
import './MainLayout.css'; // Estilos para o layout

function MainLayout() {
  // Supondo que useAuth retorne { firebaseUser }
  const { firebaseUser } = useAuth();

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
              {firebaseUser ? (
                <Link to={`/profile/${firebaseUser.displayName}`}>
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
        <Outlet /> {/* Aqui serão renderizadas as páginas Feed, Explore, Profile, etc. */}
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
