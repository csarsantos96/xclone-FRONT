import React, { useState } from 'react';
import axios from 'axios';
import './TweetCard.css';

function RepostModal({ onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Repostar Tweet</h2>
        <p>Deseja repostar este tweet?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Sim</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

function TweetCard({ tweet, token, onDelete, onLiked, onRepost }) {
  const [liked, setLiked] = useState(tweet.is_liked);
  const [showRepostModal, setShowRepostModal] = useState(false);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/tweets/${tweet.id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(response.data.status === 'liked');
      if (onLiked) onLiked();
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/tweets/${tweet.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (onDelete) onDelete(tweet.id);
    } catch (err) {
      console.error('Erro ao apagar tweet:', err);
    }
  };

  const handleReply = () => {
    alert('Abrir modal de reply para o tweet!');
  };

  const handleRepost = () => {
    setShowRepostModal(true);
  };

  const confirmRepost = async () => {
    setShowRepostModal(false);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/tweets/${tweet.id}/retweet/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (onRepost) onRepost(response.data);
      alert('Tweet repostado com sucesso!');
    } catch (error) {
      console.error('Erro ao repostar tweet:', error);
    }
  };

  // Fallback para a foto do autor
  const authorPic = tweet.author?.profile_image || '/default-avatar.png';

  return (
    <div className="tweet-card">
      <div className="author">
        {tweet.author ? (
          <>
            <img className="tweet-avatar" src={authorPic} alt="Avatar" />
            <div className="author-info">
              <div className="author-name">{tweet.author.name}</div>
              <div className="author-username">@{tweet.author.username}</div>
            </div>
          </>
        ) : (
          'Anônimo'
        )}
      </div>
      <div>{tweet.content}</div>
      {tweet.media && (
        <div className="tweet-image-wrapper">
          <img src={tweet.media} alt="Imagem do tweet" className="tweet-image" />
        </div>
      )}
      <div className="date">{new Date(tweet.created_at).toLocaleString()}</div>
      <div className="tweet-actions">
        <button className="action-button" onClick={handleLike}>
          {liked ? '💔 Descurtir' : '❤️ Curtir'}
        </button>
        <button className="action-button" onClick={handleReply}>
          💬 Reply
        </button>
        <button className="action-button" onClick={handleRepost}>
          🔁 Repost
        </button>
        {tweet.author?.id === tweet.currentUserId && (
          <button className="action-button" onClick={handleDelete}>
            🗑️ Apagar
          </button>
        )}
      </div>
      {showRepostModal && (
        <RepostModal
          onClose={() => setShowRepostModal(false)}
          onConfirm={confirmRepost}
        />
      )}
    </div>
  );
}

export default TweetCard;
