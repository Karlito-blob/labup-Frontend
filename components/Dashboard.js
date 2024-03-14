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
  CloseRounded as CloseRoundedIcon,
  AutoFixHigh as AutoFixHighIcon,
  PublicRounded as PublicRoundedIcon,
  Diversity1TwoTone,
} from '@mui/icons-material';

import styles from '../styles/Dashboard.module.css';

export default function Dashboard(props) {

  const router = useRouter();

  // const [folders, setFolders] = useState([]);
  const [updated, setUpdated] = useState(false)

  const [patterns, setPatterns] = useState([])
  const [documents, setDocuments] = useState([])
  const [exports, setExports] = useState([])

  const [newFolderName, setNewFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const token = useSelector((state) => state.user.value.token);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);


  // Fonction générique pour effectuer les requêtes fetch
  const fetchModifiedPatterns = async () => {
    try {
      const response = await fetch(`http://localhost:3000/ModifiedPatterns/${token}`);

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        setPatterns(data.ModifiedPatterns); // Assurez-vous que cette clé correspond exactement à celle retournée par votre API
      } else {
        console.error("Erreur lors de la récupération des ModifiedPatterns :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/Documents/${token}`);

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        setDocuments(data.Documents); // Assurez-vous que cette clé correspond exactement à celle retournée par votre API
      } else {
        console.error("Erreur lors de la récupération des Documents :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  }

  const fetchExports = async () => {
    try {
      const response = await fetch(`http://localhost:3000/Exports/${token}`);

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        setExports(data.Exports); // Assurez-vous que cette clé correspond exactement à celle retournée par votre API
      } else {
        console.error("Erreur lors de la récupération des Exports :", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  }

  // Utilisation dans useEffect
  useEffect(() => {
    fetchModifiedPatterns();
    fetchDocuments();
    fetchExports();
  }, [updated]);

  // const handleCreateFolder = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/folders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         token: token,
  //         projectName: newFolderName,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Erreur réseau: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (data.result) {
  //       setFolders([...folders, data.newDoc]);
  //       handleCloseDialog();
  //     } else {
  //       console.error("Erreur lors de la création du dossier :", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Erreur réseau :", error.message);
  //   }
  // };

  const handleNavigationPattern = (path, fileID) => {
    router.push(`/${path}?id=${fileID}`);
  }

  const handleDelete = async (path, fileID) => {
    try {
      const response = await fetch(`http://localhost:3000/${path}/${fileID}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result) {
        console.error(`Erreur lors de la récupération des ${path} :`, data.message);
      } else {
        setUpdated(!updated)
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }

  }

  const handlePublish = async (type, fileID, publish) => {
    try {
      const response = await fetch(`http://localhost:3000/feed/updatePublic/${type}/${fileID}/${publish}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result) {
        console.error(`Erreur lors de la récupération des ${path} :`, data.message);
      } else {
        setUpdated(!updated)
      }
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }

  }


  const handleNavigationDocument = (path, fileID) => {
    router.push(`/${path}?id=${fileID}`);
  }


  const patternsList = patterns.map((file, index) => (
    <div key={index} id={file._id} className={styles.pattern}>
      <div className={styles.imgContainer}>


        <img src={file.patternImg} />
      </div>
      <h5>{file.fileName}</h5>

      <div style={{ display: 'flex' }}>
        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <AutoFixHighIcon onClick={() => { handleNavigationPattern('createPatterns', file._id) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: file.public ? 'lightblue' : 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <PublicRoundedIcon onClick={() => { handlePublish('modifiedPatterns', file._id, !file.public) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <CloseRoundedIcon onClick={() => { handleDelete('modifiedPatterns', file._id) }} />

        </div>

      </div>




      {/* <p>{pattern.update}</p> */}
    </div>
  ))

  const documentsList = documents.map((file, index) => (
    <div key={index} id={file._id} className={styles.pattern}>
      <div className={styles.imgContainer}>


        <img src={file.documentImg} />
      </div>
      <h5>{file.fileName}</h5>

      <div style={{ display: 'flex' }}>
        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <AutoFixHighIcon onClick={() => { handleNavigationPattern('document', file._id) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: file.public ? 'lightblue' : 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <PublicRoundedIcon onClick={() => { handlePublish('document', file._id, !file.public) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <CloseRoundedIcon onClick={() => { handleDelete('document', file._id) }} />

        </div>

      </div>
      {/* <p>{pattern.update}</p> */}
    </div>
  ))

  const exportsList = exports.map((file, index) => (
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

        <img src={file.exportImg} />
      </div>
      <h5>{file.fileName}</h5>

      <div style={{ display: 'flex' }}>
        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <AutoFixHighIcon onClick={() => { handleNavigationPattern('export', file._id) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: file.public ? 'lightblue' : 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <PublicRoundedIcon onClick={() => { handlePublish('export', file._id, !file.public) }} />

        </div>

        <div style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px',
          height: '40px', width: '40px', backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <CloseRoundedIcon onClick={() => { handleDelete('export', file._id) }} />

        </div>

      </div>

      {/* <p>{pattern.update}</p> */}
    </div>
  ))

  // const folderList = folders.map((folder, index) => (
  //   <div key={index} className={styles.fileCard}>
  //     <div className={styles.iconFolder}>
  //       <FolderOpenRoundedIcon />
  //     </div>
  //     {folder.projectName}
  //   </div>
  // ));

  // Fonction pour fermer la boîte de dialogue
  // const handleCloseCreateFolderDialog = () => {
  //   setIsCreatingFolder(false);
  //   setNewFolderName('');
  // };

  // const DialogBox = () => (
  //   <Dialog open={openDialog} onClose={handleCloseDialog}>
  //     <DialogTitle>
  //       <span>Créer un nouveau dossier</span>
  //       <IconButton aria-label="close" onClick={handleCloseDialog}>
  //         <CloseIcon />
  //       </IconButton>
  //     </DialogTitle>
  //     <DialogContent>
  //       <TextField
  //         label="Nom du dossier"
  //         value={newFolderName}
  //         onChange={(e) => setNewFolderName(e.target.value)}
  //         fullWidth
  //       />
  //     </DialogContent>
  //     <Button onClick={handleCreateFolder}>Créer</Button>
  //   </Dialog>
  // );

  // Ouvrir la boîte de dialogue
  // Popup create folder
  // const handleOpenCreateFolderDialog = () => {
  //   setIsCreatingFolder(true);
  // };


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
          <div className={styles.patternsContainer}>
            {patternsList}
          </div>
        </div>
      </div>

      <div className={styles.patternSection}>
        <h3>My Documents</h3>
        {/* <AddCircleRoundedIcon onClick={handleOpenCreateFolderDialog} /> */}
        <div className={styles.wrapScrollH}>
          <div className={styles.patternsContainer}>
            {documentsList}
          </div>
        </div>
      </div>

      {/* <div className={styles.wrapScrollH}> */}
      {/* <div className={styles.folderContainer}> 
              {folderList}
            </div> */}

      {/* <div className={styles.pattern}>
            Créer un nouveau dossier
            <div className={styles.imgContainer} onClick={handleOpenCreateFolderDialog}>
              <img src="/AddFolder.png" alt="Nouveau dossier" />
            </div>
          </div> */}

      {/* Bouton "+" pour ouvrir la boîte de dialogue */}


      {/* Boîte de dialogue pour créer un nouveau dossier */}
      {/* <Dialog open={isCreatingFolder} onClose={handleCloseCreateFolderDialog}>
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
        </div> */}

      <div className={styles.patternSection}>
        <h3>My Exports</h3>
        <div className={styles.wrapScrollH}>
          <div className={styles.patternsContainer}>
            {exportsList}
          </div>
        </div>
      </div>

    </div>
  );
}    
