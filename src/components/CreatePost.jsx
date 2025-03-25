import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import './CreatePost.css';

function CreatePost({ onPostSuccess }) {
  const [text, setText] = useState('');
  const user = auth.currentUser;

  const handlePost = async () => {
    if (!text.trim()) return;

    if (!user) {
      console.error('Usuário não está logado!');
      return;
    }

    try {
      // Faz a requisição para criar o tweet
      await axios.post(
        'http://localhost:8000/api/tweets/', // URL correta para criar o tweet
        {
          content: text,
          author: user.displayName || 'Anônimo',
          photo_url: user.photoURL || '',
          uid: user.uid,
        },
        {
          headers: {
            Authorization: `Token 15a2bbc2a1b640eba442e1b44d8b8ca00ae83207`, // Coloque o token correto aqui
          },
        }
      );

      setText('');  // Limpa o campo de texto após o post
      console.log('Tweet enviado com sucesso!');

      if (onPostSuccess) onPostSuccess(); // Chama a função de sucesso para atualizar o feed
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

export default CreatePost;
