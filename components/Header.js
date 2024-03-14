import React, { useState, useEffect } from 'react';
import LogOut from './Connexion/Logout';
import DeleteAccount from './Connexion/Delete';
import styles from '../styles/UiKit.module.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';


// Import components
import Avatar from './Atomes/Avatar';
import BackButton from './Atomes/BackButton';
import TextField from '@mui/material/TextField';


// Import MUI components
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';



export default function Header({ chemin, setTitle }) {

  console.log(chemin)
  const router = useRouter()
  const user = useSelector(((state) => state.user.value))

  const [titleFile, setTitleFile] = useState('');

  // Fonction pour enregistrer le titre
  const handleSaveTitle = () => {
    setTitle(titleFile); // Met à jour le titre dans le composant parent
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // État pour suivre le bouton actif
  const [activeButton, setActiveButton] = useState('');

  // Fonction pour gérer le clic sur un bouton
  const handleButtonClick = (path) => {
    router.push(path);
    setActiveButton(path);
  };


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      position: 'fixed',
      top: '20px', // Utilisez `top` au lieu de `marginTop` pour positionner correctement l'élément en mode `fixed`
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'background.paper', // Assurez-vous que cette couleur correspond à votre thème
      borderColor: 'divider',
    }}>
      {/* Bouton Retour */}
      <Box sx={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'divider',
        borderRadius: '50px',
        padding: '10px',
        bgcolor: 'background.paper',
        color: 'text.secondary',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <BackButton />
      </Box>

      {/* Boutons de Navigation */}
      <Box sx={{
        display: 'flex',
        height: '60px',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'divider',
        borderRadius: '50px',
        padding: '10px',
        bgcolor: 'background.paper',
        color: 'text.secondary',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
      }}>



        {chemin === '/dashboard' || chemin === '/feed' ?
          <>
            <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Button onClick={() => router.push('/feed')}>Community</Button>
          </>

          :

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'}}>
            {chemin === '/createFile' ? <div style={{ marginBottom: '6px' }}>Folder / </div> : <div style={{ marginBottom: '6px' }}>Pattern / </div>}
            <TextField
              size="small"
              variant="standard"
              placeholder="Untitled"
              InputProps={{
                disableUnderline: true,
              }}
              InputLabelProps={{ shrink: false }}
              onChange={(e) => setTitleFile(e.target.value)} value={titleFile}
            />

            <Button onClick={handleSaveTitle}>Save</Button>
            {chemin === '/createFile' ? <Button>Export</Button> : <></>}

          </div>


        }


      </Box>

      {/* Avatar */}
      <Box sx={{
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'divider',
        borderRadius: '50px',
        padding: '10px',
        bgcolor: 'background.paper',
        color: 'text.secondary',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <Avatar />
      </Box>
    </div>
  );

}