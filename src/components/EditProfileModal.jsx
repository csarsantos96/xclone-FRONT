import React, { useState } from 'react';
import axios from 'axios';
import './EditProfileModal.css';

function EditProfileModal({ user, firebaseUser, onClose, onProfileUpdated }) {
  const [name, setName] = useState(user.name || '');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', name);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.patch(
        `https://csaruto96.pythonanywhere.com/api/accounts/${user.username}/`,
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
      <div className="modal-content edit-profile-modal">
        <h2>Editar Perfil</h2>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <div className="input-group">
          <label htmlFor="profileImage">Foto de Perfil:</label>
          <label htmlFor="profileImage" className="file-input-label">
            Escolher arquivo
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="file-input"
          />
          <span className="file-chosen">
            {profileImage ? profileImage.name : 'Nenhum arquivo escolhido'}
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="coverImage">Foto de Capa:</label>
          <label htmlFor="coverImage" className="file-input-label">
            Escolher arquivo
          </label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="file-input"
          />
          <span className="file-chosen">
            {coverImage ? coverImage.name : 'Nenhum arquivo escolhido'}
          </span>
        </div>

        <div className="input-group">
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-input"
          />
        </div>

        <div className="modal-actions">
          <button 
            className="save-button" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
