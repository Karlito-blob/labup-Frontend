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
import PrimaryButton from './Atomes/PrimaryButton';
import SecondaryButton from './Atomes/SecondaryButton';
import GhostButton from './Atomes/GhostButton';
import BackButton from './Atomes/BackButton';
import Help from './Atomes/Help';

// Import MUI components
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';



export default function Header(props) {
  const router = useRouter()
  const user = useSelector(((state) => state.user.value))

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };




  return (
    <div>
      <Box sx={{
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: '50px',  
        marginTop: '20px',
        bgcolor: 'background.paper',
        color: 'text.secondary', 
        position: 'fixed', 
        zIndex: 1000
      }}>

        <BackButton />
        <Stack direction='row' alignItems='center' spacing={2}>

        </Stack>
        <Stack direction='row' spacing={2}>
          {/* <GhostButton text="Export" size='medium' />
          <PrimaryButton text="Save" size='medium' /> */}
          <Divider orientation="vertical" variant="middle" flexItem />
          <Avatar />
          {/* {headerContent} */}
        </Stack>

      </Box>
    </div>

  )
}