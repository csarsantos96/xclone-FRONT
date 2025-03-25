import React, { useState } from 'react';
import axios from 'axios';
import './TweetCard.css';

function TweetCard({ tweet, token, onLiked }) {
  const [liked, setLiked] = useState(tweet.is_liked);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/tweets/${tweet.id}/like/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
        },
        }
    );
    setLiked(response.data.status === 'liked');
    
    if (onLiked) onLiked(); 
    } catch (err) {
    console.error('Erro ao curtir:', err);
    }
};

return (
    <div className="tweet">
    <img
        src={tweet.user?.photoURL || '/default-avatar.png'}
        alt="Avatar"
        className="tweet-avatar"
    />
    <div className="tweet-content">
        <strong>{tweet.user?.name || 'Anônimo'}</strong>
        <p>{tweet.text}</p>
        <button className="like-button" onClick={handleLike}>
        {liked ? '💔 Descurtir' : '❤️ Curtir'}
        </button>
        <p style={{ marginTop: '4px', fontSize: '0.9rem', color: '#999' }}>
        ❤️ {tweet.likes_count} {tweet.likes_count === 1 ? 'curtida' : 'curtidas'}
        </p>
</div>
    </div>
);
}

export default TweetCard;
