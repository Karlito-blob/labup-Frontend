import React, { useState, useEffect } from 'react';
import LogOut from './Connexion/Logout';
import DeleteAccount from './Connexion/Delete';
import styles from '../styles/UiKit.module.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Avatar from './Atomes/Avatar';
import BackButton from './Atomes/BackButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

export default function Header({ chemin, setTitle, changeSave }) {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);

  const [titleFile, setTitleFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveTitle = () => {

    if (!loading) {
      setSuccess(false);
      setLoading(true);
      setTitle(titleFile);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1000);

    }
  };

  useEffect(() => {
    if (changeSave) {
      setSuccess(false);
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        changeSave = false;
      }, 1000);

    }
  }, [changeSave]);

  useEffect(() => {
    if (success) {
      console.log('Action réussie!');
    }
  }, [success]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      position: 'fixed',
      top: '20px',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'background.paper',
      borderColor: 'divider',
    }}>
      {chemin === '/dashboard' ?
        <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'divider', borderRadius: '50px', padding: '10px', color: 'text.secondary', }}>
        </Box> :
        <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'divider', borderRadius: '50px', padding: '10px', bgcolor: 'background.paper', color: 'text.secondary', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <BackButton />
        </Box>
      }

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', height: '60px', alignItems: 'center', justifyContent: 'center', borderColor: 'divider', borderRadius: '50px', padding: '10px', bgcolor: 'background.paper', color: 'text.secondary', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
          {chemin === '/dashboard' || chemin === '/feed' ?
            <>
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Button onClick={() => router.push('/feed')}>Community</Button>
            </> :
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
              {chemin === '/createFile' ? <div style={{ marginBottom: '6px' }}>Folder / </div> : <div style={{ marginBottom: '6px' }}>Pattern / </div>}
              <TextField size="small" variant="standard" placeholder="Untitled" InputProps={{ disableUnderline: true }} InputLabelProps={{ shrink: false }} onChange={(e) => setTitleFile(e.target.value)} value={titleFile} />
              {/* Bouton modifié pour intégrer la logique de succès */}
              <Button disabled={loading} onClick={handleSaveTitle} startIcon={success ? <CheckRoundedIcon /> : undefined} >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              {loading && <CircularProgress size={24} sx={{ color: green[500], position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px', }} />}
            </div>
          }
        </Box>
      </div>

      <Box sx={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'divider', borderRadius: '50px', padding: '10px', bgcolor: 'background.paper', color: 'text.secondary', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <Avatar />
      </Box>
    </div>
  );
}
