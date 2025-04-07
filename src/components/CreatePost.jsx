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

  const displayName = user?.displayName || 'Usuário';

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <img
          src={user?.photoURL || '/default-avatar.png'}
          alt="Foto do usuário"
          className="create-post-avatar"
        />
        <span className="create-post-user-name">{displayName}</span>
      </div>

      <div className="create-post-input-area">
        <textarea
          className="create-post-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está acontecendo?"
        />
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="image-icon-button">
          <i className="fa-solid fa-image"></i>
        </label>
        <button onClick={handlePost} className="create-post-button">
          Postar
        </button>
        {image && <p className="file-name">{image.name}</p>}
        {image && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(image)}
              alt="Prévia da imagem"
              className="preview-img"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
