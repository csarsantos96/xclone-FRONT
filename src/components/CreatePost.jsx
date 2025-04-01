import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import './CreatePost.css';
import { enviarRequisicao } from '../apiService';

function CreatePost({ onPostSuccess }) {
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    if (!user) {
      console.error('Usuário não está logado!');
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        'http://localhost:8000/api/tweets/',
        {
          content: text,
          author: user.displayName || 'Anônimo',
          photo_url: user.photoURL || '',
          uid: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText('');
      console.log('Tweet enviado com sucesso!');
      if (onPostSuccess) onPostSuccess();
    } catch (error) {
      console.error('Erro ao postar tweet:', error);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-avatar-wrapper">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Foto do usuário"
          className="create-post-avatar"
        />
      </div>
      <div className="create-post-input-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está acontecendo?"
          className="create-post-textarea"
        />
        <button onClick={handlePost} className="create-post-button">
          Postar
        </button>
      </div>
    </div>
  );
}

export function TesteRequisicao() {
  useEffect(() => {
    enviarRequisicao();
  }, []);

  return <div>Verifique o console para ver a resposta da API.</div>;
}

export default CreatePost;
