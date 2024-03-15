import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Button, Dialog, DialogTitle, DialogContent, TextField, IconButton, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import {
  FolderOpenRounded as FolderOpenRoundedIcon,
  AddCircleRounded as AddCircleRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  AutoFixHigh as AutoFixHighIcon,
  AddBoxRounded as AddBoxRoundedIcon,
  PublicRounded as PublicRoundedIcon,
  FileDownloadRounded as FileDownloadRoundedIcon,
  Diversity1TwoTone,
} from '@mui/icons-material';

import styles from '../styles/Dashboard.module.css';
import ds from '../styles/DesignSystem.module.css'


export default function Dashboard(props) {

  const router = useRouter();
  const token = useSelector((state) => state.user.value.token)


  // const [folders, setFolders] = useState([]);
  const [updated, setUpdated] = useState(false)

  const [patterns, setPatterns] = useState([])
  const [documents, setDocuments] = useState([])
  const [exports, setExports] = useState([])

  const [newFolderName, setNewFolderName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const handleDownload = async (imageUrl) => {
    try {
      console.log(imageUrl)
        // Effectuer une requête AJAX pour récupérer les données de l'image
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Créer un lien temporaire pour télécharger le fichier
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'image.png');

        // Ajouter le lien à la page et déclencher le téléchargement
        document.body.appendChild(link);
        link.click();

        // Nettoyer après le téléchargement
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erreur lors du téléchargement de l'image :", error);
    }
};


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

  const handleNavigation = (path, fileID) => {
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




  const patternsList = patterns.map((file, index) => (
    <div key={index} id={file._id} className={styles.pattern}>
      <div className={styles.imgContainer}>

        <img src={file.patternImg} />
      </div>
      <h5>{file.fileName}</h5>

      <div style={{
        display: 'flex',
      }}>
        <div className={styles.icones}>
          <AutoFixHighIcon onClick={() => { handleNavigation('createPatterns', file._id) }}  />
        </div>
        <div className={styles.icones} style={{ backgroundColor: file.public ? 'lightblue' : 'white' }}>
          <PublicRoundedIcon onClick={() => { handlePublish('modifiedPatterns', file._id, !file.public) }} />
        </div>
        <div className={styles.icones}>
        <FileDownloadRoundedIcon onClick={() => handleDownload(file.patternImg)}/>
        </div>
        <div className={styles.icones}>
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
        <div className={styles.icones}>
          <AutoFixHighIcon onClick={() => { handleNavigation('createFile', file._id) }} />
        </div>

        <div className={styles.icones} style={{ backgroundColor: file.public ? 'lightblue' : 'white' }}>
          <PublicRoundedIcon onClick={() => { handlePublish('document', file._id, !file.public) }} />
        </div>

        <div className={styles.icones}>
        <FileDownloadRoundedIcon onClick={() => handleDownload(file.documentImg)}/>
        </div>

        <div className={styles.icones}>
          <CloseRoundedIcon onClick={() => { handleDelete('documents', file._id) }} />
        </div>

      </div>
      {/* <p>{pattern.update}</p> */}
    </div>
  ))

  const exportsList = exports.map((file, index) => (
    <div key={index} id={file._id} className={styles.pattern}>
      <div className={styles.imgContainer}>
        <img src={file.exportImg} />
      </div>

      <h5>{file.fileName}</h5>

      <div style={{ display: 'flex' }}>
        <div className={styles.icones} style={{ backgroundColor: file.public ? 'lightblue' : 'white' }}>
          <PublicRoundedIcon onClick={() => { handlePublish('export', file._id, !file.public) }} />
        </div>

        <div className={styles.icones}>
        <FileDownloadRoundedIcon onClick={() => handleDownload(file.exportImg)}/>
        </div>

        <div className={styles.icones}>
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

  // Theme s§tyle
  const theme = createTheme({
    palette: {
      primary: {
        light: '#5f37f4',
        main: '#3805F2',
        dark: '#2703a9',
        contrastText: '#fff',
      },
      secondary: {
        light: '#f13ff4',
        main: '#EE0FF2',
        dark: '#a60aa9',
        contrastText: '#fff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>

        <Header chemin={router.pathname} />

        <div className={styles.box} style={{ marginTop: '100px' }} >
          <h1 className={ds.xLargeHeading}>Dashboard</h1>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Button color="secondary" size="large" variant="contained" startIcon={<AddBoxRoundedIcon />} sx={{ borderRadius: '12px' }} onClick={() => router.push('/createPatterns')}>Create Pattern</Button>
            <Button color="secondary" size="large" variant="contained" startIcon={<AddBoxRoundedIcon />} sx={{ borderRadius: '12px' }} onClick={() => router.push('/createFile')}>Edit File</Button>
          </Stack>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {/* Patterns */}
          <div className={styles.patternSection}>
            <h3>My Patterns</h3>
            <div className={styles.wrapScrollH}>
              <div className={styles.patternsContainer}>
                {patternsList}
              </div>
            </div>
          </div>

          {/* Documents  */}
          <div className={styles.patternSection}>
            <h3>My Documents</h3>
            {/* <AddCircleRoundedIcon onClick={handleOpenCreateFolderDialog} /> */}
            <div className={styles.wrapScrollH}>
              <div className={styles.patternsContainer}>
                {documentsList}
              </div>
            </div>
          </div>

          {/* Exports */}
          <div className={styles.patternSection}>
            <h3>My Exports</h3>
            <div className={styles.wrapScrollH}>
              <div className={styles.patternsContainer}>
                {exportsList}
              </div>
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



      </div>
    </ThemeProvider>
  );
}    
