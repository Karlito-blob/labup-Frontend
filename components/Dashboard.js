import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Button, Dialog, DialogTitle, DialogContent, TextField, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FolderOpenRounded as FolderOpenRoundedIcon, AddCircleRounded as AddCircleRoundedIcon, Close as CloseIcon } from '@mui/icons-material';
import styles from '../styles/Dashboard.module.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function Dashboard() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const token = useSelector((state) => state.user.value.token);

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
  }, [token]);

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
  }, [token]);

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
        handleCloseCreateFolderDialog();
      } else {
        console.error("Erreur lors de la création du dossier :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  };

  // const handleDeleteDialogOpen = (folder) => {
  //   setSelectedFolder(folder);
  //   setOpenDeleteDialog(true);
  // };

  // const handleDeleteDialogClose = () => {
  //   setOpenDeleteDialog(false);
  // };

  // const handleDeleteFolder = async (deleteId) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/folders/${deleteId}`, {
  //       method: 'DELETE',
  //     });
  //     console.log('result=>' , response)

  //     if (!response.ok) {
  //       throw new Error(`Erreur réseau: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (data.result) {
  //       const updatedFolders = folders.filter(folder => folder._id !== deleteId);
  //       setFolders(updatedFolders);
  //       setOpenDeleteDialog(false);
  //     } else {
  //       console.error("Erreur lors de la suppression du dossier :", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Erreur réseau :", error.message);
  //   }
  // };

  const handleNavigation = (fileID) => {
    router.push(`/createPatterns?id=${fileID}`);
  };

  const handleOpenCreateFolderDialog = () => {
    setIsCreatingFolder(true);
  };

  const handleCloseCreateFolderDialog = () => {
    setIsCreatingFolder(false);
    setNewFolderName('');
  };


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
      <div className={styles.folderName}>
        {folder.projectName}
      </div>
      {/* <div className={styles.iconClose}>
      <CloseRoundedIcon onClick={() => handleDeleteFolder(folder._id)}/>
      </div> */}
    </div>
  ));


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


          {/* Boîte de dialogue de suppression
          <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogContent>
              {selectedFolder && (
                <div>
                  `Êtes-vous sur de vouloir supprimer le dossier ${selectedFolder.idFolder} ?` 
                </div>
              )}
            </DialogContent>
          </Dialog> */}

        </div>
      </div>
    </div>
  );
} 
