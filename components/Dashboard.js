import React from 'react';
import Header from './Header';
import { Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createSlice } from '@reduxjs/toolkit';

import styles from '../styles/Dashboard.module.css';

export default function Dashboard(props) {

  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const token = useSelector((state) => state.user.value.token);

  console.log (token)

  // afficher les dossiers users dans le dashboard

  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await fetch(`http://localhost:3000/folders/${token}`);

        if (!response.ok) {
          throw new Error(`Erreur réseau: ${response.status}`);
        }

        const data = await response.json();
        const { result, Folders } = data;

        if (result) {
          setFolders(Folders);
        } else {
          console.error("Erreur lors de la récupération des dossiers :", data.message);
        }
      } catch (error) {
        console.error("Erreur réseau :", error.message);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewFolderName(''); // Réinitialise le champ de saisie après la fermeture de la boîte de dialogue
  };

  const handleCreateFolder = () => {
    setFolders([...folders, { name: newFolderName }]);
    handleCloseDialog();
  };

  const patternData = [
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    }
  ]

  const folderList = folders.map((folder, index) => {
    console.log(folder)
    return (
      <div key={index} className={styles.pattern}>
        {folder.projectName}
        <div className={styles.imgContainer}>
        <img src="/Folder.png" alt={folder.projectName} />   
        </div>
      </div>
    )});

  const pattern = patternData.map((pattern, index) => (
    <div key={index} className={styles.pattern}>
      <div className={styles.imgContainer}>
        <img src={pattern.image} alt={pattern.title} />   
      </div>
      <h5>{pattern.title}</h5>
      <p>{pattern.update}</p>
    </div>
  ))

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.box}>
        <h2>Dashboard</h2>
        <div className={styles.buttonsContainer}>
          <Button onClick={() => router.push('/createPatterns')}>Pattern File</Button>
          <Button onClick={() => router.push('/createFile')}>Event File</Button>
        </div>
      </div>
      <div className={styles.patternSection}>
        <h3>My patterns</h3>
        <div className={styles.wrapScrollH}>
          <div className={styles.patternsContainer}>{pattern}</div>
        </div>
      </div>
      <div className={styles.folderSection}>
        <h3>My folders</h3>
        <div className={styles.wrapScrollH}>
          <div className={styles.foldersContainer}>{folderList}</div>
        </div>
      </div>
      

      {/* Boîte de dialogue pour la création de dossier */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create a new folder</DialogTitle>
        <DialogContent>
          <TextField
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <Button onClick={handleCreateFolder}>Create</Button>
      </Dialog>  
  </div>
  );
}
