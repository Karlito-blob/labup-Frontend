import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

// Import screenshot components
import html2canvas from 'html2canvas';
const b64toBlob = require('b64-to-blob');
import axios from 'axios';

// IMPORT COMPONENTS MUI
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// IMPORT ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import CropDinRoundedIcon from '@mui/icons-material/CropDinRounded';
import CropPortraitRoundedIcon from '@mui/icons-material/CropPortraitRounded';
import Crop32RoundedIcon from '@mui/icons-material/Crop32Rounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import VerticalAlignCenterRoundedIcon from '@mui/icons-material/VerticalAlignCenterRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormatSizeRoundedIcon from '@mui/icons-material/FormatSizeRounded';

import styles from '../styles/CreateFile.module.css';

export default function TextParams() {

  const router = useRouter();

  const ref = useRef(null);

  const [images, setImages] = useState([])
  const [screenshot, setScreenshot] = useState('')

  const handleTakeScreenshot = () => {
    if (ref.current) {
      html2canvas(ref.current)
        .then((canvas) => {
          console.log("j'ai cliqué")
          const imageData = canvas.toDataURL('image/png');
          console.log(imageData)
          setImages((prevImages) => [...prevImages, imageData]);
          console.log(imageData)
        })
    }  
  };
  // Mapping des screenshots 
  const screenshots = images.map((img, index) => {
    return (
      <div key={index} style={{ position: 'relative', color: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img key={index} src={img} alt={`screenshot-${index}`} style={{ width: '120px', height: '120px', borderRadius: '10px', margin: '16px' }} onClick={() => showScreenShot(index)} />
          {`screenshot-${index + 1}`}
        </div>

        <button
          style={{
            position: 'absolute', top: '0', right: '0',
            background: 'white', border: 'none', cursor: 'pointer', borderRadius: '30px', 
          }}
          onClick={() => setImages(images.filter((el) => el !== img))}
        >
          <CloseRoundedIcon />
        </button>
      </div>
    );
  });
  // Affichage screenshot
  const showScreenShot = (id) => {
    setScreenshot(images[id])
  }

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul screenshot)
  const handleExport = async () => {
    //constantes de simulation en attendant l'intéractivité totale de la page 
    const token = "v8Zt251kII7rwj5pWQv-YtpweEZJeQed"
    const fileName = "Coucou"
    const fileType = "coucou.jpg"
    const documentContent = [{
      zoneName: 'coucou',
      contenu: 'coucou',
      size: 8,
      font: 'coucou',
      color: 'coucou',
      posX: 10,
      posY: 8
    }];
    const formData = new FormData()
    //recupere uniquement la partie base 64 du resultat de use react screen
    const imageData = images.toString().split(',')[1];
    //transformation en blob pour moins transfert
    const blob = b64toBlob(imageData, 'image/png');
    //transformation en file avant intégration au formData
    const file = new File([blob], 'photo.png', { type: 'image/png' });
    //construction du formData avec un file et des champs de texte (A FACTORISER MAIS FLEMME TOUT DE SUITE)
    formData.append("photoFromFront", file);
    formData.append("token", token);
    formData.append("fileType", fileType);
    formData.append("documentContent", JSON.stringify(documentContent));
    formData.append("fileName", fileName);
    //utilisation de axios pour la requete en multiple formData CAR FETCH CEST NUL A *****
    axios.post("http://localhost:3000/documents/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then(res => {
      console.log("TEST THEO", res)
    })
  }

  const handleParamsProject = () => (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
      <MenuItem>
          <ListItemText>Show version history</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Duplicate</ListItemText>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Delete...</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );

  // Settings the format of the frame //
  const [formatWidth, setFormatWidth] = useState(750); // State of width
  const [formatHeight, setFormatHeight] = useState(750); // State of height
  const [justifyContent, setJustifyContent] = useState('flex-start'); // State of justify-content
  const [padding, setPadding] = useState(12);
  const handleChangeFormat = (event, value) => {
    const [newFormatWidth, newFormatHeight] = value;
    setFormatWidth(newFormatWidth);
    setFormatHeight(newFormatHeight);
  }; // Action to change the format
  const childrenFormat = [
    <Tooltip title="Format square">
      <ToggleButton value={[640, 640]} key="square">
        <CropDinRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Story">
      <ToggleButton value={[360, 640]} key="story">
        <CropPortraitRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Cover">
      <ToggleButton value={[640, 360]} key="landscape">
        <Crop32RoundedIcon />
      </ToggleButton>
    </Tooltip>,
  ];
  const controlFormat = {
    value: formatWidth,
    onChange: handleChangeFormat,
    exclusive: true,
  };
  const handleChangeJustifyContent = (event, newJustifyContent) => {
    setJustifyContent(newJustifyContent);
  }; // Action to change justify-content
  const childrenJustifyContent = [
    <Tooltip title="Align Top">
      <ToggleButton value="flex-start" key="Align Top">
        <VerticalAlignTopRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Align Center">
      <ToggleButton value="center" key="Align Center">
        <VerticalAlignCenterRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Align Bottom">
      <ToggleButton value="flex-end" key="Align Bottom">
        <VerticalAlignBottomRoundedIcon />
      </ToggleButton>
    </Tooltip>,
        <Tooltip title="Align Justify">
        <ToggleButton value="space-between" key="Align Justify">
          <FormatLineSpacingRoundedIcon />
        </ToggleButton>
      </Tooltip>,
  ];
  const controlJustifyContent = {
    value: justifyContent,
    onChange: handleChangeJustifyContent,
    exclusive: true,
  };
  const handleChangePadding = (event, newPadding) => {
    setPadding(newPadding);
  }; // Action to change the padding
  // End of settings the format of the frame //

  const [zoomLevel, setZoomLevel] = useState(1);
  const handleZoomChange = (event, newZoomLevel) => {
    setZoomLevel(newZoomLevel);
  };
  const zoomStyle = {
    transform: `scale(${zoomLevel})`,
    transition: 'transform 0.3s ease-in-out',
  };

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
      margin: theme.spacing(0.5),
      border: 0,
      borderRadius: theme.shape.borderRadius,
      [`&.${toggleButtonGroupClasses.disabled}`]: {
        border: 0,
      },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
      {
        marginLeft: -1,
        borderLeft: '1px solid transparent',
      },
  }));


  const user = useSelector(((state) => state.user.value))
  function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  // État pour stocker la liste des polices
  const [fontData, setFontData] = useState([]);
  const [fontFamily, setFontFamily] = useState(''); // State of font-family
  // Utilisation de l'effet secondaire useEffect pour récupérer les données de police à partir de l'API.
  useEffect(() => {
    fetch('http://localhost:3000/fonts')
      .then(response => response.json())
      .then(data => {
        setFontData(data);
      })
      .catch(error => {
        console.error('Error fetching fonts:', error);
      });
  }, []);
  // Variable mapping of table of fontData
  const nameFontOptions = fontData.map((font, index) => ({
    label: font.name, 
    value: font.name,
  }));
  // Variable contain url
  const importUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.split(" ").join("+")}&display=swap`;
  // Fonction pour appliquer la police
  const handleFontChange = (event) => {
    setFontFamily(event.target.textContent || '');
  };

  // État pour stocker la liste des valeurs des inputs avec paramètres
  const [valeursInputs, setValeursInputs] = useState([
    { valeur: '', enGras: false, enItalique: false, tailleTexte: '16px', alignementTexte: 'left', textTransform: 'none' },
  ]);

  // État pour stocker la div sélectionnée pour le popup
  const [divSelectionneePopup, setDivSelectionneePopup] = useState(null);

  // État pour stocker les styles individuels des inputs
  const [stylesInputs, setStylesInputs] = useState([]);

  // État pour stocker la div sélectionnée
  const [divSelectionnee, setDivSelectionnee] = useState(null);

  // Fonction pour mettre à jour la valeur d'un input spécifique
  const handleChange = (index, value) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].valeur = value;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour appliquer ou enlever le style gras d'un input
  const toggleGras = (index) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].enGras = !nouvellesValeurs[index].enGras;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour appliquer ou enlever le style italique d'un input
  const toggleItalique = (index) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].enItalique = !nouvellesValeurs[index].enItalique;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour changer la taille du texte d'un input
  const changerTailleTexte = (index, taille) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].tailleTexte = taille;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour changer l'alignement du texte d'un input
  const changerAlignementTexte = (index, alignement) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].alignementTexte = alignement;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour changer la transformation du texte d'un input
  const changerTextTransform = (index, transform) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs[index].textTransform = transform;
    setValeursInputs(nouvellesValeurs);
  };

  // Fonction pour sélectionner une div
  const selectionnerDiv = (index) => {
    setDivSelectionnee(index);
    setDivSelectionneePopup(index);
  };

  // Fonction pour désélectionner la div dans le popup
  const deselectionnerDivPopup = () => {
    setDivSelectionneePopup(null);
  };

  // Fonction pour ajouter un nouvel input
  const ajouterInput = () => {
    setValeursInputs([
      ...valeursInputs,
      { valeur: '', enGras: false, enItalique: false, tailleTexte: 'normal' },
    ]);
  };
  
  // Fonction pour supprimer un input en fonction de l'index
  const supprimerInput = () => {
    if (divSelectionneePopup !== null && divSelectionneePopup >= 0 && divSelectionneePopup < valeursInputs.length) {
      const nouvellesValeurs = [...valeursInputs];
      nouvellesValeurs.splice(divSelectionneePopup, 1);
      setValeursInputs(nouvellesValeurs);
      setDivSelectionneePopup(null);
    }
  };
  
  // Effet secondaire pour mettre à jour automatiquement les styles individuels
  useEffect(() => {
    const nouveauxStyles = valeursInputs.map((input) => ({
      fontWeight: input.enGras ? 'bold' : 'normal',
      fontStyle: input.enItalique ? 'italic' : 'normal',
      fontSize: input.tailleTexte,
      textAlign: input.alignementTexte || 'left',
      textTransform: input.textTransform || 'none',
    }));
    setStylesInputs(nouveauxStyles);
  }, [valeursInputs]);

  // Variable des inputs mappé avec option supprimer
  const inputs = valeursInputs.map((input, index) => (
    <div
      key={index}
      onClick={() => selectionnerDiv(index)}
      style={{
        padding: '10px',
        marginBottom: '10px',
        cursor: 'pointer',
      }}
    >
      <input
        type="text"
        value={input.valeur}
        onChange={(e) => handleChange(index, e.target.value)}
        placeholder="Entrez votre texte"
      />
    </div>
  ));

  // Variable de la liste des valeurs individuelles mappé
  const valeursIndividuellesListe = valeursInputs.map((input, index) => (
    <p
      key={index}
      onClick={() => selectionnerDiv(index)}
      style={{
        cursor: 'pointer',
        ...stylesInputs[index],
      }}
    >
      {input.valeur}
    </p>
  ));

  // Variable du bloc Valeurs Individuelles
  const valeursIndividuellesBloc = valeursInputs.length > 0 && (
    <div>
        {valeursIndividuellesListe}
    </div>
  );

  // Variable de la popUp
  const popupContenu = divSelectionneePopup !== null && (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Paper
      elevation={0}
      sx={{
      display: 'flex',
      border: (theme) => `1px solid ${theme.palette.divider}`,
      flexWrap: 'wrap',
      }}
      >
        <StyledToggleButtonGroup
        size="small"
        value={valeursInputs[divSelectionneePopup]?.alignementTexte}
        onChange={(e) => changerAlignementTexte(divSelectionneePopup, e.target.value)}
        exclusive
        aria-label="text alignment"
        >
        <ToggleButton value="left">
        <FormatAlignLeftRoundedIcon />
        </ToggleButton>
        <ToggleButton value="center">
        <FormatAlignCenterRoundedIcon />
        </ToggleButton>
        <ToggleButton value="right">
        <FormatAlignRightRoundedIcon />
        </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
        size="small"
        aria-label="text formatting"
        >
        <ToggleButton value="bold" onClick={() => toggleGras(divSelectionneePopup)} aria-label="bold">
        <FormatBoldRoundedIcon />
        </ToggleButton>
        <ToggleButton value="italic" onClick={() => toggleItalique(divSelectionneePopup)} aria-label="italic">
        <FormatItalicRoundedIcon />
        </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <Select
        id="demo-simple-select"
        displayEmpty
        value={valeursInputs[divSelectionneePopup]?.textTransform || 'none'}
        onChange={(e) => changerTextTransform(divSelectionneePopup, e.target.value)}
        >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="uppercase">Uppercase</MenuItem>
        <MenuItem value="lowercase">Lowercase</MenuItem>
        <MenuItem value="capitalize">Capitalize</MenuItem>
        </Select>
        <Select
        id="demo-simple-select"
        displayEmpty
        value={valeursInputs[divSelectionneePopup]?.tailleTexte || '16px'}
        onChange={(e) => changerTailleTexte(divSelectionneePopup, e.target.value)}
        >
        <MenuItem value="12px">Small</MenuItem>
        <MenuItem value="16px">Normal</MenuItem>
        <MenuItem value="24px">Medium</MenuItem>
        <MenuItem value="40px">Large</MenuItem>
        <MenuItem value="64px">Extra large</MenuItem>
        </Select>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <ToggleButton value="delete"  onClick={supprimerInput} aria-label="delete">
        <DeleteForeverRoundedIcon />
        </ToggleButton>

      </Paper>
      <button onClick={deselectionnerDivPopup}>Fermer le Popup</button>
    </div>
  );
  
  return (
  <div className={`${styles.viewport} ${styles.polka}`}>
  <style jsx> {`@import url(${importUrl})`} </style>
    <div className={styles.header}> 
      <Tooltip title="Back" arrow>
      <IconButton aria-label="back" onClick={() => router.push('/dashboard')}>
        <ArrowBackIcon />
      </IconButton>
      </Tooltip>
      <div className={styles.settingProject}>
      <TextField
      size="small"
      variant="standard"
      placeholder="Untilted"
      InputProps={{disableUnderline: true }}
      InputLabelProps={{shrink: false}}
      />
      <IconButton aria-label="chevron" onClick={handleParamsProject}>
        <ExpandMoreRoundedIcon />
      </IconButton>
      </div>
      <div className={styles.settingProfile}>
      <Avatar {...stringAvatar(user.userName)} />
      <IconButton aria-label="chevron">
        <ExpandMoreRoundedIcon />
      </IconButton>
      </div>
    </div>
    <div className={styles.canvas} style={zoomStyle} ref={ref}>
      <div className={styles.file} style={{ width: `${formatWidth}px`, height: `${formatHeight}px`, padding: `${padding}px`}}>
        <div className={styles.textContainer} style={{ justifyContent }}>
          {valeursIndividuellesBloc}
          {divSelectionneePopup !== null && popupContenu}
        </div>
      </div>
    </div>
    <div className={styles.bottom}>
    <div >
              <h1 style={{ color: 'white' }}> Screenshots </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {screenshots}
              </div>
              <button style={{width: "100px", height: "100px"}} onClick={() => handleExport()}>EXPORT</button>
            </div>
      <div className={styles.boxLeft}>
        {inputs}
        <button onClick={ajouterInput}>Ajouter Input</button>
      </div>
      <div className={styles.boxMiddle}>
        <Stack spacing={2} alignItems="center" direction="row">
          <StyledToggleButtonGroup size="small" {...controlJustifyContent} aria-label="Small sizes">
          {childrenJustifyContent}
          </StyledToggleButtonGroup>
          <ToggleButtonGroup size="small" {...controlFormat} aria-label="Small sizes">
          {childrenFormat}
          </ToggleButtonGroup>
          <IconButton aria-label="camera" onClick={() => handleTakeScreenshot()}>
            <CameraRoundedIcon />
          </IconButton>
        </Stack>
      </div>
      <div className={styles.boxRight}>
      <Box sx={{ height: 80 }}>
          <Slider
            sx={{
              '& input[type="range"]': {
                WebkitAppearance: 'slider-vertical',
              },
            }}
            orientation="vertical"
            value={zoomLevel}
            min={0.1}
            max={2}
            step={0.1}
            onChange={handleZoomChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}x`}
          />
        </Box>
        <Tooltip title="Help" arrow>
          <IconButton aria-label="help">
            <QuestionMarkRoundedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  </div>
  );
};