import React, { useRef, useState, useEffect } from 'react'
import styles from '../styles/CreateFile.module.css';
import { useRouter } from 'next/router';

// Import screenshot components
import html2canvas from 'html2canvas';
const b64toBlob = require('b64-to-blob');
import axios from 'axios';

// Import components
import Header from './Header';
import Avatar from './Atomes/Avatar';
import PrimaryButton from './Atomes/PrimaryButton';
import SecondaryButton from './Atomes/SecondaryButton';
import GhostButton from './Atomes/GhostButton';
import BackButton from './Atomes/BackButton';
import Help from './Atomes/Help';

// Import MUI components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { Autocomplete, Slider } from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLess';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CropDinRoundedIcon from '@mui/icons-material/CropDinRounded';
import CropPortraitRoundedIcon from '@mui/icons-material/CropPortraitRounded';
import Crop32RoundedIcon from '@mui/icons-material/Crop32Rounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import VerticalAlignCenterRoundedIcon from '@mui/icons-material/VerticalAlignCenterRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormatSizeRoundedIcon from '@mui/icons-material/FormatSizeRounded';

export default function TextParams() {

  const router = useRouter(); 

  const [titleFile, setTitleFile] = useState('');
  const [fontData, setFontData] = useState([]); // State of api fetch
  const [fontFamily, setFontFamily] = useState(''); // State of font-family

  useEffect(() => {
    fetch('http://localhost:3000/fonts')
      .then(response => response.json())
      .then(data => {
        setFontData(data);
      })
      .catch(error => {
        console.error('Error fetching fonts:', error);
      });
  }, []); // Fetch fonts router
  const nameFontOptions = fontData.map((font, index) => ({
    label: font.name,
    value: font.name,
  })); // Mapping of table of fontData
  const importUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.split(" ").join("+")}&display=swap` // Variable contain url
  const handleFontChange = (event) => {
    setFontFamily(event.target.textContent || '');
  }; // Action to change the font-family


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

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul screenshot)
  const ref = useRef(null);
  const [images, setImages] = useState("")
  const handleSave = () => {
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
    //if (!images) return ;
    //constantes de simulation en attendant l'intéractivité totale de la page 
    const token = "v8Zt251kII7rwj5pWQv-YtpweEZJeQed"
    const fileName = titleFile
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
      }
    })
      .then(res => {
        console.log("TEST THEO", res)
      })
  }
  //////////////////////////////////

  const [formatWidth, setFormatWidth] = useState(640); // State of width
  const [formatHeight, setFormatHeight] = useState(640); // State of height
  const [justifyContent, setJustifyContent] = useState('space-between'); // State of justify-content
  const [padding, setPadding] = useState(12);
  const handleChangeFormat = (event, value) => {
    const [newFormatWidth, newFormatHeight] = value;
    setFormatWidth(newFormatWidth);
    setFormatHeight(newFormatHeight);
  }; // Action to change the format
  const childrenFormat = [
    <Tooltip title="Format square">
      <ToggleButton value={[640, 640]} key="square">
        Square
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Story">
      <ToggleButton value={[360, 640]} key="story">
        Story
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Cover">
      <ToggleButton value={[640, 360]} key="landscape">
        Slide
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


  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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

  // État pour stocker la liste des valeurs des inputs avec paramètres
  const [valeursInputs, setValeursInputs] = useState([
    { valeur: '', enGras: false, enItalique: false, tailleTexte: '16px', alignementTexte: 'left', textTransform: 'none', fontFamily },
  ]);
  // Variable des inputs mappé avec option supprimer
  const inputs = valeursInputs.map((input, index) => (
    <div
      key={index}
      style={{
        padding: '16px',
        cursor: 'pointer',
      }}
    >
      <Stack direction='row' justifyContent='space-between'>
        <p>Text {index + 1}</p>
        <IconButton size="small" onClick={() => handleDeleteInput()} aria-label="delete">
          <DeleteForeverRoundedIcon />
        </IconButton>
      </Stack>
      <TextField
        id="outlined-basic"
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Enter your text"
        value={input.valeur}
        onChange={(e) => handleChange(index, e.target.value)}
        onClick={() => selectionnerDiv(index)} />
    </div>
  ));
  // Fonction pour ajouter un nouvel input
  const AddInput = () => {
    setValeursInputs([
      ...valeursInputs,
      { valeur: '', enGras: false, enItalique: false, tailleTexte: 'normal' },
    ]);
  };
  // Fonction pour supprimer un input en fonction de l'index
  const handleDeleteInput = (index) => {
    const nouvellesValeurs = [...valeursInputs];
    nouvellesValeurs.splice(index, 1);
    setValeursInputs(nouvellesValeurs);
  };

  // Effet secondaire pour mettre à jour automatiquement les styles individuels
  useEffect(() => {
    const nouveauxStyles = valeursInputs.map((input) => ({
      fontFamily: input.fontFamily,
      fontWeight: input.enGras ? 'bold' : 'normal',
      fontStyle: input.enItalique ? 'italic' : 'normal',
      fontSize: input.tailleTexte || '16px',
      textAlign: input.alignementTexte || 'left',
      textTransform: input.textTransform || 'none',
    }));
    setStylesInputs(nouveauxStyles);
    console.log('nouveaux:', nouveauxStyles);
  }, [valeursInputs]);
  // Variable de la liste des valeurs individuelles mappé
  const valeursIndividuellesListe = valeursInputs.map((input, index) => (
    <p
      key={index}
      onClick={() => selectionnerDiv(index)}
      style={{
        margin: 0,
        overflowWrap: 'break-word',
        cursor: 'pointer',
        ...stylesInputs[index],
        color: 'white',
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

  console.log(valeursInputs);
  // Variable de la popUp
  const popupContenu = divSelectionneePopup !== null && (
    <Paper
      elevation={12}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        borderRadius: '8px',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        onChange={handleFontChange}
        options={nameFontOptions}
        getOptionSelected={(option, value) => option.value === value.value}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} />}
      />
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
      <button onClick={deselectionnerDivPopup}>Fermer le Popup</button>
    </Paper>
  );

  return (
    <Box className={`${styles.viewport} ${styles.polka}`}>
      <style jsx> {`@import url(${importUrl})`} </style>

      {/* HEADER SECTION  */}
      {/* <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        color: 'text.secondary',
        '& svg': {
          m: 1,
        },
        '& hr': {
          mx: 0.5,
        },
      }}>
        <BackButton />
        <Stack direction='row' alignItems='center' spacing={2}>
          <p>Folder /</p>
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
          <IconButton aria-label="chevron">
            <ExpandMoreRoundedIcon />
          </IconButton>
        </Stack>
        <Stack direction='row' spacing={2}>
          <GhostButton text="Export" size='medium' />
          <PrimaryButton text="Save" size='medium' onClick={handleSave} />
          <Divider orientation="vertical" variant="middle" flexItem />
          <Avatar />
        </Stack>
      </Box> */}

      <Header chemin={router.pathname} />

      {/* LAYOUT SECTION  */}
      <Box sx={{
        width: formatWidth,
        height: formatHeight,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 1,
        bgcolor: 'primary.main',
      }}
        style={{ display: 'flex', flexDirection: 'column', justifyContent }}
        ref={ref}
      >
        <div style={{ position: 'absolute', padding }}>
          {valeursIndividuellesBloc}
        </div>
        <img src='test1.gif' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      {/* TOOLBOX  */}
      <Box sx={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        {popupContenu}
      </Box>
      <Paper elevation={24} sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        width: '16%',
        marginLeft: '40px',
        marginTop: '80px',
      }}>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Content" />
          {open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider flexItem sx={{ mx: 0.5, my: 1 }} />
          <Stack direction='row' justifyContent='space-between' padding='8px'>
            <p>Align content</p>
            <StyledToggleButtonGroup size="small" {...controlJustifyContent} aria-label="Small sizes" sx={{ display: 'flex', flexDirection: 'space' }}>
              {childrenJustifyContent}
            </StyledToggleButtonGroup>
          </Stack>
          <Divider flexItem sx={{ mx: 0.5, my: 1 }} />
          <Stack direction='row' alignItems='center' justifyContent='space-between' padding='8px'>
            <p>Margin</p>
            <Box sx={{ width: 208, paddingRight: '24px' }}>
              <Slider
                aria-label="Padding"
                defaultValue={12}
                value={padding}
                onChange={handleChangePadding}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={4}
                marks
                min={4}
                max={40}
              />
            </Box>
          </Stack>
          <Divider flexItem sx={{ mx: 0.5, my: 1 }} />
          <List component="div" disablePadding>
            {inputs}
            <SecondaryButton text="Add new field" onClick={AddInput} />
          </List>
        </Collapse>
      </Paper>
      <Box>
        <Paper elevation={24} sx={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          borderRadius: '8px',
          gap: '12px',
        }}>
          <p>Format: </p>
          <ToggleButtonGroup size="small" {...controlFormat} aria-label="Small sizes">
            {childrenFormat}
          </ToggleButtonGroup>
        </Paper>
      </Box>
    </Box>
  )
}