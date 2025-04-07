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

  // Lógica de fallback para a foto de perfil:
  const profilePic = profile.profile_image || '/default-avatar.png';

  return (
    <div className="profile-container">
      {/* Adiciona position: relative para posicionamento absoluto do botão */}
      <div className="profile-header" style={{ position: 'relative' }}>
        <img
          className="cover-photo"
          src={profile.cover_image || '/default-cover.png'}
          alt="Cover"
        />
        <div className="profile-info">
          <img
            className="profile-avatar"
            src={profilePic}
            alt="Avatar"
          />
          <h2>{profile.name || 'Nome do usuário'}</h2>
          <p>@{profile.username}</p>
          <div className="profile-stats">
            <span>{profile.following_count} seguindo</span>
            <span>{profile.followers_count} seguidores</span>
          </div>
        </div>
        {/* Botão de Editar Perfil posicionado no canto inferior direito */}
        {profile.username === username && (
          <button 
            className="edit-profile-button" 
            onClick={() => setShowEditModal(true)}
          >
            Editar Perfil
          </button>
        )}
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
