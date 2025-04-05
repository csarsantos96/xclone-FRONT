// EditProfileModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './EditProfileModal.css';

function EditProfileModal({ user, firebaseUser, onClose, onProfileUpdated }) {
  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profileImage, setProfileImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (bio.length > 140) {
      setErrorMsg('A bio deve ter no máximo 140 caracteres.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('bio', bio);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.patch(
        `http://localhost:8000/api/accounts/${username}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onProfileUpdated(response.data);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMsg('Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Editar Perfil</h2>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        <label>Foto de Perfil:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Nome de Usuário:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Bio (máx. 140 caracteres):</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={140}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
