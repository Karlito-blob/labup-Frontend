import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducers/user';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Modal from '@mui/material/Modal';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter ();

  const token = useSelector(state => state.user.value.token);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleDeleteAccount = () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

  /* Nav supp password avec TAB à vérifier et terminer

    const handleTabPress = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault(); 

        const isPasswordFieldFocused = event.target.id === 'password';
        
        if (isPasswordFieldFocused) {
          document.getElementById('confirmPassword').focus();
        } else {
          document.getElementById('password').focus();
        }
      }
    };

  */
    

    setIsDeleting(true);

    fetch('https://labup-backend.vercel.app/users/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(logout());
          setIsModalOpen(false);
          router.push("/");
        } else {
          setError('Erreur lors de la suppression du compte.');
        }
      })
      .catch(error => {
        setError('Une erreur s\'est produite lors de la communication avec le serveur.');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>Supprimer le compte</Button>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
  <div style={{
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',  // Ajustez la largeur selon vos besoins
  }}>
    <h2 style={{ textAlign: 'center' }}>Supprimer le compte</h2>
    <p style={{ textAlign: 'center' }}>Confirmez la suppression de votre compte en saisissant votre mot de passe. Elle sera définitive !</p>

    <div style={{ marginBottom: '10px', textAlign: 'left' }}>
      <label htmlFor="password">Mot de passe :</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        style={{ width: '100%' }}
      />
    </div>

    <div style={{ marginBottom: '10px', textAlign: 'left' }}>
      <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        style={{ width: '100%' }}
      />
    </div>

    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

    <div style={{ marginTop: '20px', textAlign: 'right' }}>
      <Button onClick={handleDeleteAccount} disabled={isDeleting}>
        {isDeleting ? 'Suppression en cours...' : 'Supprimer le compte'}
      </Button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default DeleteAccount;
