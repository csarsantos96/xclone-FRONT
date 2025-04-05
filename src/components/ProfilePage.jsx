// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { username } = useParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Atualiza o perfil depois da edição
  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // Monitora o usuário autenticado no Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Busca os dados do perfil e dos tweets
  useEffect(() => {
    if (!firebaseUser) return;
    const fetchProfileData = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const userResponse = await axios.get(
          `http://localhost:8000/api/accounts/${username}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(userResponse.data);
        const tweetsResponse = await axios.get(
          `http://localhost:8000/api/tweets/user/${username}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTweets(tweetsResponse.data.results || tweetsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        setErrorMsg('Usuário não encontrado ou erro no servidor.');
      }
    };
    fetchProfileData();
  }, [firebaseUser, username]);

  if (errorMsg) return <div>{errorMsg}</div>;
  if (!profile) return <div>Carregando perfil...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          className="cover-photo"
          src={profile.coverPhoto || '/default-cover.png'}
          alt="Cover"
        />
        <div className="profile-info">
          {/* Exibe o botão de editar somente se o username da URL for o mesmo que o do perfil */}
          {profile.username === username && (
            <button onClick={() => setShowEditModal(true)}>Editar Perfil</button>
          )}
          <img
            className="profile-avatar"
            src={profile.avatar || '/default-avatar.png'}
            alt="Avatar"
          />
          <h2>{profile.name || 'Nome do usuário'}</h2>
          <p>@{profile.username}</p>
          <p className="bio">{profile.bio}</p>
          <div className="profile-stats">
            <span>{profile.following_count} seguindo</span>
            <span>{profile.followers_count} seguidores</span>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={profile}             // Perfil retornado pelo backend
          firebaseUser={firebaseUser} // Objeto do Firebase para getIdToken
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      <div className="profile-tweets">
        {tweets.length === 0 ? (
          <p>Nenhum tweet por enquanto.</p>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="tweet-card">
              <p>{tweet.content}</p>
              {tweet.media && (
                <div className="tweet-image-wrapper">
                  <img src={tweet.media} alt="Imagem do tweet" className="tweet-image" />
                </div>
              )}
              <div className="date">
                {new Date(tweet.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
