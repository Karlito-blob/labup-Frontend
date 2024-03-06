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
    

    setIsDeleting(true);

    fetch('http://localhost:3000/users/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(logout());
          setIsModalOpen(false);
          router.push("/")
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
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', position: 'relative' }}>
            <h2>Supprimer le compte</h2>
            <p>Confirmez la suppression de votre compte en saisissant votre mot de passe.</p>

            <div style={{ position: 'relative' }}>
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                style={{ marginBottom: '10px' }}
              />

              <label htmlFor="confirmPassword" style={{ position: 'absolute', top: '0', left: '50%' }}>Confirmez le mot de passe :</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                style={{ position: 'absolute', top: '30px', left: '50%' }}
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? 'Suppression en cours...' : 'Supprimer le compte'}
            </Button>
          </div>
        </Modal>

    </div>
  );
};

export default DeleteAccount;
