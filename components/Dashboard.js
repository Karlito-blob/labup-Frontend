import React from 'react';
import Header from './Header';
import { Button, Dialog, DialogTitle, DialogContent, TextField, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';

import CloseIcon from '@mui/icons-material/Close';
import {
  FolderOpenRounded as FolderOpenRoundedIcon,
  AddCircleRounded as AddCircleRoundedIcon,
  AutoFixHigh as AutoFixHighIcon,
} from '@mui/icons-material';

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

  const handleNavigation = (fileID) => {
    router.push(`/createPatterns?id=${fileID}`);
  }

  const filesList = files.map((file, index) => (
    <div key={index} id={file._id} className={styles.pattern}>
      <div className={styles.imgContainer}>
        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'absolute', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <AutoFixHighIcon onClick={() => { handleNavigation(file._id) }} />
        </div>

        <img src={file.image} />
      </div>
      <h5>{file.fileName}</h5>
      {/* <p>{pattern.update}</p> */}
    </div>
  ))


  const folderList = folders.map((folder, index) => (
    <div key={index} className={styles.fileCard}>
      <div className={styles.iconFolder}>
        <FolderOpenRoundedIcon />
      </div>
      {folder.projectName}
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

      <Header chemin={router.pathname} />

      <div className={styles.box} style={{ marginTop: '100px' }} >
        <h1>Dashboard</h1>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h3>My folders</h3>
          <AddCircleRoundedIcon onClick={handleOpenCreateFolderDialog} />
        </div>

        <div className={styles.wrapScrollH}>
          <div className={styles.folderContainer}>
            {folderList}
          </div>

          {/* <div className={styles.pattern}>
            Créer un nouveau dossier
            <div className={styles.imgContainer} onClick={handleOpenCreateFolderDialog}>
              <img src="/AddFolder.png" alt="Nouveau dossier" />
            </div>
          </div> */}

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
