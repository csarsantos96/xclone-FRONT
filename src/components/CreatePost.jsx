import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import './CreatePost.css';

function CreatePost({ onPostSuccess }) {
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    // Permite post com texto e/ou imagem
    if (!text.trim() && !image) {
      console.error('Informe texto ou selecione uma imagem para postar!');
      return;
    }
    if (!user) {
      console.error('Usuário não está logado!');
      return;
    }

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append('content', text);
      if (image) {
        formData.append('media', image);
      }

      await axios.post('http://localhost:8000/api/tweets/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setText('');
      setImage(null);
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
          src={user?.photoURL || '/default-avatar.png'}
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
        {/* Input de arquivo escondido */}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {/* Label estilizado que abre o input de arquivo */}
        <label htmlFor="file-input" className="custom-file-label">
          Escolher imagem
        </label>
        {/* Mostra o nome do arquivo, se houver */}
        {image && <p className="file-name">{image.name}</p>}
        {/* Preview da imagem */}
        {image && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(image)}
              alt="Prévia da imagem"
              className="preview-img"
            />
          </div>
        )}
        <button onClick={handlePost} className="create-post-button">
          Postar
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
