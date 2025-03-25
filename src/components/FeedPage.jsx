import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedPage.css';

import CreatePost from '../components/CreatePost';

function FeedPage() {
const [tweets, setTweets] = useState([]);


const fetchTweets = () => {
    axios.get('http://localhost:8000/api/tweets/feed/',{
        headers: {
            Authorization: `Token 15a2bbc2a1b640eba442e1b44d8b8ca00ae83207` 
        }
    })
    .then(response => {
        setTweets(response.data.results);
    })
    .catch(error => {
        console.error('Erro ao buscar tweets:', error);
    });
};


useEffect(() => {
    fetchTweets();
}, []);

return (
    <div className="feed-container">
    <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Feed de Tweets</h2>
    <CreatePost onPostSuccess={fetchTweets} />
{tweets.length === 0 ? (
        <p>Nenhum tweet disponível.</p>
    ) : (
        tweets.map(tweet => (
        <div key={tweet.id} className="tweet-card">
            <p className="author">@{tweet.author}</p>
            <p className="content">{tweet.content}</p>
            <p className="date">{new Date(tweet.created_at).toLocaleString()}</p>

            <div className="tweet-actions">
                <button className="action-button">❤️ {tweet.likes || 0}</button>
                <button className="action-button">💬 {tweet.comments?.length || 0}</button>
                <button className="action-button">🔁</button>
</div>

            {tweet.media && (
            <div className="media">
                <a href={tweet.media} target="_blank" rel="noopener noreferrer">Ver mídia</a>
            </div>
            )}
        </div>
        ))
    )}
    </div>
);
}

export default FeedPage;
