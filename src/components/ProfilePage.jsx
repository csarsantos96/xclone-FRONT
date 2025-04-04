// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { username } = useParams();

  // 1) Monitora o usuário autenticado no Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2) Quando o usuário estiver autenticado, busca dados do perfil
  useEffect(() => {
    if (!firebaseUser) return;

    // Definimos a função aqui dentro
    const fetchProfileData = async () => {
      try {
        const token = await firebaseUser.getIdToken();

        // 1. Busca os dados do usuário no backend
        const userResponse = await axios.get(
          `http://localhost:8000/api/users/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setProfile(userResponse.data);

        // 2. Busca os tweets do usuário
        const tweetsResponse = await axios.get(
          `http://localhost:8000/api/tweets/user/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTweets(tweetsResponse.data.results || tweetsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };

    // Chama a função
    fetchProfileData();
  }, [firebaseUser, username]);

  if (!profile) {
    return <div>Carregando perfil...</div>;
}

return (
    <div className="profile-container">
      {/* Cabeçalho com informações do perfil */}
    <div className="profile-header">
        <img
        className="cover-photo"
        src={profile.coverPhoto || '/default-cover.png'}
        alt="Cover"
        />
        <div className="profile-info">
        <img
            className="profile-avatar"
            src={profile.avatar || '/default-avatar.png'}
            alt="Avatar"
        />
        <h2>{profile.displayName || 'Nome do usuário'}</h2>
        <p>@{profile.username}</p>
        <p className="bio">{profile.bio}</p>
        <div className="profile-stats">
            <span>{profile.following_count} seguindo</span>
            <span>{profile.followers_count} seguidores</span>
        </div>
        {profile.username === firebaseUser.displayName && (
            <button className="edit-profile-button">Editar Perfil</button>
        )}
        </div>
    </div>

      {/* Seção para exibir os tweets */}
    <div className="profile-tweets">
        {tweets.map((tweet) => (
        <div key={tweet.id} className="tweet-card">
            <p>{tweet.content}</p>
            {/* Caso o tweet tenha uma imagem, exiba-a */}
            {tweet.media && (
            <div className="tweet-image-wrapper">
                <img
                src={tweet.media}
                alt="Imagem do tweet"
                className="tweet-image"
                />
            </div>
            )}
            <div className="date">
            {new Date(tweet.created_at).toLocaleString()}
            </div>
        </div>
        ))}
    </div>
    </div>
);
}

export default ProfilePage;
