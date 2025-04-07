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
  const [isFollowing, setIsFollowing] = useState(false); // Estado para indicar se o usuário logado segue o perfil
  const { username } = useParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Função para atualizar o perfil após edição
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

  // Busca os dados do perfil e dos tweets do backend
  useEffect(() => {
    if (!firebaseUser) return;
    const fetchProfileData = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        // Obtém os dados do usuário pelo username (rota do backend)
        const userResponse = await axios.get(
          `http://localhost:8000/api/accounts/${username}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedProfile = userResponse.data;
        setProfile(fetchedProfile);
        // Se a API retornar o campo is_following, atualizamos o estado
        if (typeof fetchedProfile.is_following === 'boolean') {
          setIsFollowing(fetchedProfile.is_following);
        }
        // Obtém os tweets do usuário
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

  // Enquanto houver erro ou o profile não for carregado, exibe uma mensagem apropriada
  if (errorMsg) return <div>{errorMsg}</div>;
  if (!profile) return <div>Carregando perfil...</div>;

  // Fallback para a foto de perfil: utiliza profile.profile_image se existir, senão um avatar default
  const profilePic = profile?.profile_image || '/default-avatar.png';

  // Define se o perfil acessado é o do usuário logado.
  // É importante que o backend retorne o username do usuário logado de forma consistente.
  const isOwnProfile = 
  !!(firebaseUser && profile && profile.email && (profile.email === firebaseUser.email));

  // Função para seguir/deixar de seguir o usuário
  const handleFollowToggle = async () => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.post(
        `http://localhost:8000/api/accounts/follow/${profile.username}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.is_following);
      // Atualiza a contagem de seguidores conforme o retorno da API
      setProfile((prev) => ({
        ...prev,
        followers_count: response.data.followers_count,
      }));
    } catch (err) {
      console.error("Erro ao seguir/deixar de seguir:", err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ position: 'relative' }}>
        <img
          className="cover-photo"
          src={profile?.cover_image || '/default-cover.png'}
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
        {/* Se for o próprio perfil do usuário logado, exibe "Editar Perfil"; caso contrário, o botão de seguir */}
        {isOwnProfile ? (
          <button
            className="edit-profile-button"
            onClick={() => setShowEditModal(true)}
          >
            Editar Perfil
          </button>
        ) : (
          <button
            className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          user={profile}
          firebaseUser={firebaseUser}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Lista de tweets do usuário */}
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
