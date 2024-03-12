import React from 'react';
import Header from './Header';
import { Button, Dialog, DialogTitle, DialogContent, TextField, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import styles from '../styles/Dashboard.module.css';

export default function Dashboard(props) {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([])
  const [newFolderName, setNewFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const token = useSelector((state) => state.user.value.token);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/folders/${token}`);

        if (!response.ok) {
          throw new Error(`Erreur réseau: ${response.status}`);
        }

        const data = await response.json();

        if (data.result) {
          setFolders(data.Folders);
        } else {
          console.error("Erreur lors de la récupération des dossiers :", data.message);
        }
      } catch (error) {
        console.error("Erreur réseau :", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataFile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/dashboard/${token}`);

        if (!response.ok) {
          throw new Error(`Erreur réseau: ${response.status}`);
        }

        const data = await response.json();

        if (data.result) {
          setFiles(data.dashboardData);
        } else {
          console.error("Erreur lors de la récupération des dossiers :", data.message);
        }
      } catch (error) {
        console.error("Erreur réseau :", error.message);
      }
    }

    fetchDataFile();
  }, []);

  const handleCreateFolder = async () => {
    try {
      const response = await fetch('http://localhost:3000/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          projectName: newFolderName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        setFolders([...folders, data.newDoc]);
        handleCloseDialog();
      } else {
        console.error("Erreur lors de la création du dossier :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
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

  const filesList = files.map((file, index) => (
    <div key={index} className={styles.pattern}>
      <div className={styles.imgContainer}>
        <img src={file.image} />   
      </div>
      <h5>{file.fileName}</h5>
      {/* <p>{pattern.update}</p> */}
    </div>
  ))


  const folderList = folders.map((folder, index) => (
    <div key={index} className={styles.pattern}>
      {folder.projectName}
      <div className={styles.imgContainer}>
        <img src="/Folder.png" alt={folder.projectName} />   
      </div>
    </div>
  ));
  
  // Ouvrir la boîte de dialogue
  const handleOpenCreateFolderDialog = () => {
    setIsCreatingFolder(true);
  };

    // Fonction pour fermer la boîte de dialogue
  const handleCloseCreateFolderDialog = () => {
    setIsCreatingFolder(false);
    setNewFolderName('');
  };
  
    
  
    const DialogBox = () => (
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <span>Créer un nouveau dossier</span>
          <IconButton aria-label="close" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nom du dossier"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <Button onClick={handleCreateFolder}>Créer</Button>
      </Dialog>
    );
  

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
            <div className={styles.patternsContainer}>{filesList}</div>
          </div>
        </div>
        <div className={styles.folderSection}>
          <h3>My folders</h3>
          <div className={styles.wrapScrollH}>
            <div className={styles.foldersContainer}>
              {folderList}
            
            <div className={styles.pattern}>
            Créer un nouveau dossier
            <div className={styles.imgContainer} onClick={handleOpenCreateFolderDialog}>
              <img src="/AddFolder.png" alt="Nouveau dossier" />   
            </div>
          </div>
            </div>
    
            {/* Bouton "+" pour ouvrir la boîte de dialogue */}
            
    
            {/* Boîte de dialogue pour créer un nouveau dossier */}
            <Dialog open={isCreatingFolder} onClose={handleCloseCreateFolderDialog}>
              <DialogTitle>
                <span>Créer un nouveau dossier</span>
                <IconButton aria-label="close" onClick={handleCloseCreateFolderDialog}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Nom du dossier"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  fullWidth
                />
              </DialogContent>
              <Button onClick={handleCreateFolder}>Créer</Button>
            </Dialog>
          </div>
        </div>
      </div>
    );
}    
