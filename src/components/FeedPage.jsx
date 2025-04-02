import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import './FeedPage.css';
import CreatePost from '../components/CreatePost';
import LogoutButton from './LogOutButton';




function FeedPage() {
    const [tweets, setTweets] = useState([]);
    const [firebaseUser, setFirebaseUser] = useState(null);

  
    const fetchTweets = async (user) => {
      if (!user) {
        console.log("Usuário não logado.");
        return;
      }
  
      try {
        const token = await user.getIdToken();
        const response = await axios.get("http://localhost:8000/api/tweets/feed/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          fetchTweets(user);     // Usa o user autenticado
        } else {
          console.log("Usuário não logado.");
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
        <div className="feed-container">
          <header className="feed-header">
          <h2>Feed de Tweets</h2>
          <LogoutButton />
      </header>

          {firebaseUser && (
      <div className="user-info">
        
        <span>{firebaseUser.displayName}</span>
      </div>
    )}
      
          <CreatePost onPostSuccess={() => fetchTweets(firebaseUser)} />
      
          {tweets.length === 0 ? (
            <p>Nenhum tweet por enquanto.</p>
          ) : (
            tweets.map(tweet => (
              <div key={tweet.id} className="tweet-card">
                <div className="author">{tweet.author?.username || 'Anônimo'}</div>
                <div>{tweet.content}</div>
                <div className="date">{new Date(tweet.created_at).toLocaleString()}</div>
                <div className="tweet-actions">
                  <button className="action-button">❤️</button>
                  <button className="action-button">💬</button>
                  <button className="action-button">🔁</button>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

export default FeedPage;