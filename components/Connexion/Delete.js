import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducers/user';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const token = useSelector(state => state.user.value.token)
  const dispatch = useDispatch()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleDeleteAccount = () => {
    // Vérifiez si les mots de passe correspondent avant de delette
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // --> supprimer un compte définitivement
    
    setIsDeleting(true);
    fetch('http://localhost:3000/users/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    }).then(response => response.json())
        .then(data => {
            if (data.result) {
                dispatch(logout())
                setIsDeleting(false)
            }
        });
  };

  return (
    <div>
      <Button onClick={handleClick}>delete</Button>
    </div>
  );

};

/*
  return (
    <div>
      <h2>Supprimer le compte</h2>
      <p>Confirmez la suppression de votre compte en saisissant votre mot de passe.</p>

      <label htmlFor="password">Mot de passe :</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        disabled={isDeleting}
      />

      <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        disabled={isDeleting}
      />

      <button onClick={handleDeleteAccount} disabled={isDeleting}>
        {isDeleting ? 'Suppression en cours...' : 'Supprimer le compte'}
      </button>
    </div>
  );
};
*/

export default DeleteAccount;