import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './CreatePost.css';

// Função para garantir que a imagem tenha a URL completa
function getFullImageUrl(imagePath) {
  if (!imagePath) return null;
  // Se já for URL completa, retorna
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Caso contrário, concatena a URL base (ajuste conforme seu ambiente)
  return `https://csaruto96.pythonanywhere.com${imagePath}`;
}

function CreatePost({ onPostSuccess }) {
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Monitora o usuário do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Obter dados do usuário no backend (que deve retornar 'profile_image')
          const response = await axios.get('https://csaruto96.pythonanywhere.com/api/accounts/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
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
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append('content', text);
      if (image) {
        formData.append('media', image);
      }

      await axios.post('https://csaruto96.pythonanywhere.com/api/tweets/', formData, {
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

  // Lógica de fallback para a foto do usuário:
  // Se user.profile_image existir, usa getFullImageUrl para garantir URL completa;
  // senão, usa '/default-avatar.png'
  const userPic = user && user.profile_image
    ? getFullImageUrl(user.profile_image)
    : '/default-avatar.png';

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        {/* Foto de perfil do usuário */}
        <img
          src={userPic}
          alt="Foto do usuário"
          className="create-post-avatar"
        />
        <span className="create-post-user-name">{user ? user.name : 'Usuário'}</span>
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

        {/* Opcional: mostrar o nome do arquivo e preview */}
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
