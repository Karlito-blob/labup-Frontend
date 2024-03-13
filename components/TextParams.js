import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/CreateFile.module.css';
import ds from '../styles/DesignSystem.module.css'
import { TwitterPicker as ColorPicker } from 'react-color';
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

// Import MUI components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import { Autocomplete, Button, Modal, Slider } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignJustifyRoundedIcon from '@mui/icons-material/FormatAlignJustifyRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import VerticalAlignCenterRoundedIcon from '@mui/icons-material/VerticalAlignCenterRounded';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';

export default function TextParams() {

  const router = useRouter(); 

  const token = useSelector((state) => state.user.value.token)
  const ref = useRef(null);

  const [fileName, setFileName] = useState('');
  const [images, setImages] = useState([])
  const [indexModif, setIndex] = useState(0);
  const [indexImage, setIndexImage] = useState(null)
  const [fontData, setFontData] = useState([]); 
  const [patternsData, setPatternsData] = useState([]);
  const [inputParams, setInputParams] = useState([
      {
          inputValue: '',
          isBold: false,
          isItalic: false,
          isUnderline: false,
          textTransform: 'none',
          textAlign: 'left',
          fontFamily: 'Inter',
          fontSize: '1rem',
          color:'#FFF'
      },
  ]);
  const [canvaParams, setCanvaParams] = useState ({
    width: '650px',
    height: '650px',
    justifyContent: 'flex-start',
    padding: 12,
    backgroundImage: "url('test1.gif')",
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul screenshot)
  const handleSave = (index) => {
    if (ref.current) {
      html2canvas(ref.current)
        .then((canvas) => {
          const image = canvas.toDataURL('image/png');
          setImages((prevImages) => [...prevImages, image]);
          const formData = new FormData();
          const imageData = images[index].toString().split(',')[1];
          const blob = b64toBlob(imageData, 'image/png');
          const file = new File([blob], 'photo.png', { type: 'image/png' });
          formData.append("photoFromFront", file);
          formData.append("token", token);
          formData.append("fileName", fileName);
          formData.append("documentContent", JSON.stringify(inputParams));
          formData.append("canvaParams", JSON.stringify(canvaParams));
          
          axios.post("http://localhost:3000/documents/", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            console.log("TEST THEO", res);
          });
        });
    }
  }
  //////////////////////////////////

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul screenshot)
  const handleExport = (index) => {
    if (ref.current) {
        html2canvas(ref.current)
            .then((canvas) => {
            console.log("j'ai cliqué")
            const image = canvas.toDataURL('image/png');
            setImages((prevImages) => [...prevImages, image]);
            const formData = new FormData()
            const imageData = images[index].toString().split(',')[1];
            const blob = b64toBlob(imageData, 'image/png');
            const file = new File([blob], 'photo.png', { type: 'image/png' });
            formData.append("photoFromFront", file);
            formData.append("token", token);
            formData.append("ExportName", fileName);
            formData.append("ExportType", 'coucou');
            axios.post("http://localhost:3000/exports/", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(res => {
                console.log("TEST THEO", res)
            });
        });
    }
  }
  //////////////////////////////////

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
  const nameFontOptions = fontData.map((font, index) => ({
    label: font.name, 
    value: font.name,
  }));

  useEffect(() => {
    fetch(`http://localhost:3000/modifiedPatterns/${token}`)
    .then(response => response.json())
    .then(data => {
      if(data.result){
        setPatternsData(data.ModifiedPatterns);
      }
    })
    .catch(error => {
      console.error('Error fetching fonts:', error);
    })
  },[]);

  const importUrl = `https://fonts.googleapis.com/css2?family=${inputParams[0].fontFamily.split(" ").join("+")}&display=swap`;
  const handleFontChange = (e) => {
    const selectedFont = e.target.textContent || '';
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            fontFamily: selectedFont,
        };
        return updatedParams;
    });
  };
  const handleClickBold = () => {
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            isBold: !updatedParams[indexModif].isBold,
        };
        return updatedParams;
    });
  };
  const handleClickItalic = () => {
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            isItalic: !updatedParams[indexModif].isItalic,
        };
        return updatedParams;
    });
  };
  const handleClickUnderline = () => {
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            isUnderline: !updatedParams[indexModif].isUnderline,
        };
        return updatedParams;
    });
  };
  const handleWriteValue = (index, e) => {
    setIndex(index); // Mise à jour de l'index lors de la saisie
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[index] = {
            ...updatedParams[index],
            inputValue: e.target.value,
        };
        return updatedParams;
    });
  };
  const handleColorChange = (color) => {
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            color: color.hex,
        };
        return updatedParams;
    });
  }
  const handleAlignment = (newAlignment) => {
      setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
          ...updatedParams[indexModif],
          textAlign: newAlignment,
        };
        return updatedParams;
      });
  };
  const handleFontSize = (newSize) => {
    setInputParams(prevState => {
        const updatedParams = [...prevState];
        updatedParams[indexModif] = {
            ...updatedParams[indexModif],
            fontSize: newSize,
        };
        return updatedParams;
    });
  };
  const handleTextTransform = (newTextTransform) => {
    setInputParams(prevState => {
      const updatedParams = [...prevState];
      updatedParams[indexModif] = {
          ...updatedParams[indexModif],
          textTransform: newTextTransform,
      };
      return updatedParams;
  });
  };
  const handleClickAddInput = () => {
    setInputParams(prevState => [
        ...prevState,
        {
            inputValue: '',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            textTransform: 'none',
            textAlign: 'left',
            fontFamily: 'Inter',
            fontSize: '1rem',
            color:'#fff'
        },
    ]);
  };

  // FONCTION SETTINGS CANVAS
  const handleChangeFormat = (newWidth, newHeight) => {
    setCanvaParams(prevParams => ({
        ...prevParams,
        width: `${newWidth}px`,
        height: `${newHeight}px`
    }));
  }
  const handleChangeJustifyContent = (newJustifyContent) => {
    setCanvaParams(prevParams => ({
        ...prevParams,
        justifyContent: newJustifyContent
    }));
  };
  const handleChangePadding = (newPadding) => {
    setCanvaParams(prevParams => ({
        ...prevParams,
        padding: newPadding
    }));
  };
  const handleChangeBgImage = (newBackground, index) => {
    setIndexImage(index)
    setCanvaParams(prevParams => ({
        ...prevParams,
        backgroundImage: `url(${newBackground})`,
    }));
  }
  //////////////////////////////////

  const imagesCarrousel = patternsData.map((image, index) => (
    <img 
    key={index} 
    src={image.patternImg} 
    alt={`Image ${index}`} 
    style={{width: '200px', height: '150px', objectFit: 'cover'}}
    onClick={() => handleChangeBgImage (image.patternImg, index)}
    />
  ));

  const chooseFormat = 
    <Stack direction='row'>
      <Tooltip title="Format square">
          <ToggleButton value={[640, 640]} key="square" onClick={() => handleChangeFormat(640, 640)}>
              Square
          </ToggleButton>
      </Tooltip>
      <Tooltip title="Format Story">
          <ToggleButton value={[360, 640]} key="story" onClick={() => handleChangeFormat(360, 640)}>
              Story
          </ToggleButton>
      </Tooltip>
      <Tooltip title="Format Cover">
          <ToggleButton value={[640, 360]} key="landscape" onClick={() => handleChangeFormat(640, 360)}>
              Slide
          </ToggleButton>
      </Tooltip>
    </Stack>
  ;

  const chooseJustififyContent = 
    <Stack direction='row'>
      <Tooltip title="Align Top">
        <ToggleButton value="flex-start" key="Align Top" onClick={() => handleChangeJustifyContent('flex-start')}>
            <VerticalAlignTopRoundedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Align Center">
        <ToggleButton value="center" key="Align Center" onClick={() => handleChangeJustifyContent('center')}>
            <VerticalAlignCenterRoundedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Align Bottom">
        <ToggleButton value="flex-end" key="Align Bottom" onClick={() => handleChangeJustifyContent('flex-end')}>
            <VerticalAlignBottomRoundedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Align Justify">
        <ToggleButton value="space-between" key="Align Justify" onClick={() => handleChangeJustifyContent('space-between')}>
            <HeightRoundedIcon />
        </ToggleButton>
      </Tooltip>
    </Stack>
  ;

  const chooseTextAlign =
    <Stack direction="row" alignItems='center' justifyContent='space-between'>
      <p className={ds.label}>Text Align</p>
      <Stack direction="row" alignItems='center'>
        <ToggleButton value="start" aria-label="left aligned" onClick={() => handleAlignment("left")}>
          <FormatAlignLeftRoundedIcon />
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered" onClick={() => handleAlignment("center")}>
          <FormatAlignCenterRoundedIcon />
        </ToggleButton>
        <ToggleButton value="end" aria-label="right aligned" onClick={() => handleAlignment("right")}>
          <FormatAlignRightRoundedIcon/>
        </ToggleButton>
        <ToggleButton value="justify" aria-label="justified" onClick={() => handleAlignment("justify")}>
          <FormatAlignJustifyRoundedIcon />
        </ToggleButton>
      </Stack>
    </Stack>
  ;

  const chooseStyleFont =
  <Stack direction='row' alignItems='center' justifyContent='space-between'>
    <p className={ds.label}>Text style</p>
    <Stack direction= 'row'>
      <Tooltip title="Bold">
          <ToggleButton value="bold" key="Bold" onClick={handleClickBold}>
              <FormatBoldRoundedIcon />
          </ToggleButton>
          <ToggleButton value="bold" key="Bold" onClick={handleClickItalic}>
              <FormatItalicRoundedIcon />
          </ToggleButton>
          <ToggleButton value="bold" key="Bold" onClick={handleClickUnderline}>
              <FormatUnderlinedRoundedIcon />
          </ToggleButton>
        </Tooltip>
    </Stack>
  </Stack>
  ;

  const chooseFontSize =
  <Stack>
    <p className={ds.label}>Size</p>
      <FormControl sx={{ minWidth: 120 }} size="small">
      <Select
      id="demo-select-small"
      value={inputParams[indexModif].fontSize}
      onChange={(e) => handleFontSize(e.target.value)}
      >
      <MenuItem value="0.5rem">Small</MenuItem>
      <MenuItem value="1rem">Normal</MenuItem>
      <MenuItem value="1.5rem">Medium</MenuItem>
      <MenuItem value="2rem">Large</MenuItem>
      <MenuItem value="2.5rem">Extra Large</MenuItem>
      <MenuItem value="4rem">Hudge</MenuItem>
      </Select>
    </FormControl>
  </Stack>

  const chooseTextTransform =
  <Stack direction='row' alignItems='center' justifyContent='space-between'>
    <p className={ds.label}>Text Transform</p>
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
    <Select
    id="demo-select-small"
    value={inputParams[indexModif].textTransform}
    onChange={(e) => handleTextTransform(e.target.value)}
    >
      <MenuItem value="none">None</MenuItem>
      <MenuItem value="uppercase">Uppercase</MenuItem>
      <MenuItem value="capitalize">Capitalize</MenuItem>
      <MenuItem value="lowercase">Lowercase</MenuItem>
    </Select>
    </FormControl>
  </Stack>
  ;

  const chooseFont =
  <Stack sx={{width: '90%'}}>
    <p className={ds.label}>Font</p>
    <Autocomplete
    disablePortal
    value={inputParams[indexModif].fontFamily}
    id="combo-box-demo"
    onChange={handleFontChange}
    options={nameFontOptions}
    getOptionSelected={(option, value) => option.value === value.value}
    size="small"
    renderInput={(params) => <TextField {...params}/>}
  />
  </Stack>
  ;

  const inputs = inputParams.map((params, index) => (
    <input
    key={index}
    onChange={(e) => handleWriteValue(index, e)}
    onClick={() => setIndex(index)}
    value={params.inputValue} />
  ));
  const texts = inputParams.map((params, index) => (
    <p
    key={index}
    style={{
      margin: 0,
      fontWeight: params.isBold ? 'bold' : 'normal',
      fontStyle: params.isItalic ? 'italic' : 'normal',
      textDecoration: params.isUnderline ? 'underline' : 'none',
      textTransform: params.textTransform,
      textAlign: params.textAlign,
      fontFamily: params.fontFamily,
      fontSize: params.fontSize,
      color: params.color,
    }}
    >
        {params.inputValue}
    </p>
  ));

  const textStyle = 
  <Paper sx={{
    width: '20%',
    height: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }}>
    <Stack direction='row' alignItems='center' gap='12px'>
      {chooseFont}
      {chooseFontSize}
    </Stack>
    <Divider />
    {chooseTextAlign}
    {chooseStyleFont}
    {chooseTextTransform}
    <Divider />
    <ColorPicker 
      onChangeComplete={handleColorChange}
      color={inputParams.color}
      triangle='hide'
    />
  </Paper>
  ;

  const canvaStyle =
  <Paper sx={{
    width: '20%',
    height: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }}>
    {chooseFormat}
    {chooseJustififyContent}
    <Slider
      aria-label="Padding"
      defaultValue={12}
      value={canvaParams.padding}
      onChange={(event, newValue) => handleChangePadding(newValue)}
      valueLabelDisplay="auto"
      shiftStep={30}
      step={4}
      marks
      min={4}
      max={40}
      />
    {inputs}
    <SecondaryButton text="Add new field" onClick={handleClickAddInput}/>
  </Paper>
  ;

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

    // Fonction pour supprimer un input en fonction de l'index
    const handleDeleteInput = (index) => {
      const nouvellesValeurs = [...valeursInputs];
      nouvellesValeurs.splice(index, 1);
      setValeursInputs(nouvellesValeurs);
    };

    return (
        <Box className={`${styles.viewport} ${styles.polka}`}>
          <style> {`@import url(${importUrl})`} </style>
            {/* HEADER SECTION  */}
            <Box sx={{
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
                <BackButton/>
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
                        onChange={(e)   => setFileName(e.target.value)} value={fileName}
                    />
                </Stack>
                <Stack direction='row' spacing={2}>
                    <GhostButton text="Export" size='medium'/>
                    <PrimaryButton text="Save" size='medium' onClick={() => handleSave()}/>
                    <Divider orientation="vertical" variant="middle" flexItem/>
                    <Avatar/>
                </Stack>
            </Box>
            <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            }}>
            {canvaStyle}
            {textStyle}
            </Box>
            <Box sx={{
              width: canvaParams.width,
              height: canvaParams.height,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'primary.main',
              display: 'flex',flexDirection: 'column',
              justifyContent: canvaParams.justifyContent,
              backgroundImage: canvaParams.backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              }}
              style={{ }}
              ref={ref}
              >
                <div style={{width: '100%', wordWrap: 'break-word', position: 'absolute', padding: canvaParams.padding}}>
                  {texts}
                </div>
            </Box>
            {imagesCarrousel}
            <div>
            <Button variant="contained" onClick={() => handleOpen()}>Open Modal</Button>
              <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
              backdrop: {
              timeout: 500,
              },
              }}
              >
                <Fade in={open}>
                  <Box sx={styleModal}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                      Exports
                    </Typography>
                    <Box>
                        <Typography id="transition-modal-description">
                        {canvaParams.width} x {canvaParams.height}
                        </Typography>
                      <Button variant="contained" onClick={() => handleExport(indexImage)}>Export</Button>
                    </Box>
                  </Box>
                </Fade>
              </Modal>
            </div>
            <Button variant="contained" onClick={() => handleSave(indexImage)}>test</Button>
        </Box>
    )
}