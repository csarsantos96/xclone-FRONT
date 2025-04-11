import React from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './LogOutButton.css';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('Usuário deslogado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sair
    </button>
  );
}

export default LogoutButton;
