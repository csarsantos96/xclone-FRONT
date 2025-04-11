import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import CreatePost from '../components/CreatePost';
import LogoutButton from './LogOutButton';
import TweetCard from './TweetCard';
import './FeedPage.css'; // Arquivo de estilos

function FeedPage() {
  const [tweets, setTweets] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState('');

  const fetchTweets = async (user) => {
    if (!user) return;
    try {
      const t = await user.getIdToken();
      setToken(t);
      const response = await axios.get("https://csaruto96.pythonanywhere.com/api/tweets/feed/", {
        headers: {
          Authorization: `Bearer ${t}`,
        },
      });
      setTweets(response.data.results || response.data);
    } catch (error) {
      console.error("Erro ao buscar tweets:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        fetchTweets(user);
      } else {
        console.log("Usuário não logado.");
      }
    });
    return () => unsubscribe();
  }, []);

  // Função para atualizar a lista de tweets após a exclusão
  const handleDeleteTweet = (tweetId) => {
    setTweets((prevTweets) => prevTweets.filter(tweet => tweet.id !== tweetId));
  };

  // Função para inserir o novo tweet (retweet) no feed
  const handleRepostInFeed = (newTweet) => {
    setTweets((prevTweets) => [newTweet, ...prevTweets]);
  };

  return (
    <div className="feed-container">
      {/* Barra superior */}
      <header className="top-bar">
        <h2>Home</h2>
        <LogoutButton />
      </header>

      {/* Caixa de criação de post */}
      <CreatePost onPostSuccess={() => fetchTweets(firebaseUser)} />

      {/* Lista de tweets */}
      {tweets.length === 0 ? (
        <p>Nenhum tweet por enquanto.</p>
      ) : (
        tweets.map((tweet) => (
          <TweetCard 
            key={tweet.id} 
            tweet={{ ...tweet, currentUserId: firebaseUser?.id }}
            token={token}
            onDelete={handleDeleteTweet}
            onRepost={handleRepostInFeed}
          />
        ))
      )}
    </div>
  );
}

export default FeedPage;