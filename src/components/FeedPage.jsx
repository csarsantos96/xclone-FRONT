import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedPage.css'; 

const FeedPage = () => {
const [tweets, setTweets] = useState([]);

useEffect(() => {
    axios.get('http://localhost:8000/api/tweets/feed/')
    .then(response => {
        setTweets(response.data.results);
    })
    .catch(error => {
        console.error('Erro ao buscar tweets:', error);
    });
}, []);

return (
    <div className="feed-container">
    <h2>Feed de Tweets</h2>
    {tweets.length === 0 ? (
        <p>Nenhum tweet disponível.</p>
    ) : (
        tweets.map(tweet => (
        <div key={tweet.id} className="tweet-card">
            <p className="author">@{tweet.author}</p>
            <p className="content">{tweet.content}</p>
            <p className="date">{new Date(tweet.created_at).toLocaleString()}</p>
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
};

export default FeedPage;
