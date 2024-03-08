import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

// IMPORT ICONS //
import CropDinRoundedIcon from '@mui/icons-material/CropDinRounded';
import CropPortraitRoundedIcon from '@mui/icons-material/CropPortraitRounded';
import Crop32RoundedIcon from '@mui/icons-material/Crop32Rounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import FormatAlignJustifyRoundedIcon from '@mui/icons-material/FormatAlignJustifyRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import VerticalAlignCenterRoundedIcon from '@mui/icons-material/VerticalAlignCenterRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import FormatLineSpacingRoundedIcon from '@mui/icons-material/FormatLineSpacingRounded';
import FormatSizeRoundedIcon from '@mui/icons-material/FormatSizeRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import styles from '../styles/CreateFile.module.css';

export default function TextParams() {

  const router = useRouter();

    const [values, setValues] = useState([]); // Use an array to store multiple input values
  
    const handleChange = (index, value) => {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    };
  
    const handleAddField = () => {
      setValues([...values, '']); // Add a new empty value to the array
    };
    const handleRemoveField = (index) => {
      const newValues = [...values];
      newValues.splice(index, 1); // Supprimez l'élément à l'index spécifié
      setValues(newValues);
    };

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

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  const [zoomLevel, setZoomLevel] = useState(1);
  const handleZoomChange = (event, newZoomLevel) => {
    setZoomLevel(newZoomLevel);
  };
  const zoomStyle = {
    transform: `scale(${zoomLevel})`,
    transition: 'transform 0.3s ease-in-out',
  };

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
      <ToggleButton value={[750, 750]} key="square">
        <CropDinRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Story">
      <ToggleButton value={[350, 750]} key="story">
        <CropPortraitRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Format Cover">
      <ToggleButton value={[750, 350]} key="landscape">
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

  // Settings inputs for the content //
  const [eventTitle, setEventTitle] = useState('');
  const [eventLineUp, setEventLineUp] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const handleInputEventTitleChange = (e) => {
    setEventTitle(e.target.value);
  };
  const handleInputEventLineUpChange = (e) => {
    setEventLineUp(e.target.value);
  };
  const handleInputEventStartChange = (e) => {
    setEventStart(e.target.value);
  };
  const handleInputEventEndChange = (e) => {
    setEventEnd(e.target.value);
  };
  // End of settings inputs on the frames //

  // Settings of font //
  const [fontData, setFontData] = useState([]); // State of api fetch
  const [fontFamily, setFontFamilmy] = useState(''); // State of font-family
  const [fontSize, setFontSize] = useState(30); // State of font-size
  const [textAlign, setTextAlign] = useState('left'); // State of text-align
  const [textTransform, setTextTransform] = useState('none'); // State of text-transform
  const [fontWeight, setFontWeight] = useState('normal'); // State of font-weight
  const [fontStyle, setFontStyle] = useState('normal'); // State of font-weight
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
    setFontFamilmy(event.target.textContent || '');
  }; // Action to change the font-family
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  }; // Action to change font-size
  const handleChangeAlignment = (event, newAlignment) => {
    setTextAlign(newAlignment);
  }; // Action to change text-align
  const childrenAlign = [
    <ToggleButton value="left" key="left">
      <FormatAlignLeftRoundedIcon />
    </ToggleButton>,
    <ToggleButton value="center" key="center">
      <FormatAlignCenterRoundedIcon />
    </ToggleButton>,
    <ToggleButton value="right" key="right">
      <FormatAlignRightRoundedIcon />
    </ToggleButton>,
    <ToggleButton value="justify" key="justify">
      <FormatAlignJustifyRoundedIcon />
    </ToggleButton>,
  ];
  const controlAlign = {
    value: textAlign,
    onChange: handleChangeAlignment,
    exclusive: true,
  };
  const handleChangeTransform = (event, newTextTransform) => {
    setTextTransform(newTextTransform);
  }; // Action to change text-transform
  const childrenTextTranform = [
    <Tooltip title="None">
      <ToggleButton value="none" key="None">
        <FormatSizeRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Uppercase">
      <ToggleButton value="uppercase" key="Uppercase">
        <FormatSizeRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Lowercase">
      <ToggleButton value="lowercase" key="Align Bottom">
        <FormatSizeRoundedIcon />
      </ToggleButton>
    </Tooltip>,
  ];
  const controlTextTranform = {
    value: textTransform,
    onChange: handleChangeTransform,
    exclusive: true,
  };
  const handleChangeWeight = (event, newFontWeight) => {
    setFontWeight(newFontWeight);
  }; // Action to change fontWeight
  const childrenFontWeight = [
    <Tooltip title="Normal">
      <ToggleButton value="normal" key="None">
        <FormatBoldRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Bold">
      <ToggleButton value="bold" key="bold">
        <FormatBoldRoundedIcon />
      </ToggleButton>
    </Tooltip>,
  ];
  const controlFontWeight = {
    value: fontWeight,
    onChange: handleChangeWeight,
    exclusive: true,
  };
  const handleChangeStyle = (event, newFontStyle) => {
    setFontStyle(newFontStyle);
  }; // Action to change fontWeight
  const childrenFontStyle = [
    <Tooltip title="Normal">
      <ToggleButton value="normal" key="normal">
        <FormatItalicRoundedIcon />
      </ToggleButton>
    </Tooltip>,
    <Tooltip title="Italic">
      <ToggleButton value="italic" key="italic">
        <FormatItalicRoundedIcon />
      </ToggleButton>
    </Tooltip>,
  ];
  const controlFontStyle = {
    value: fontStyle,
    onChange: handleChangeStyle,
    exclusive: true,
  };
  // End of settings of font //

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function valuetext(value) {
    return `${value}°C`;
  }
  return (
  <div className={styles.viewport}>
    <div className={styles.header}> 
      <Tooltip title="Back" arrow>
        <IconButton aria-label="back" onClick={() => router.push('/testEditor')}>
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
        <IconButton aria-label="chevron">
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
    <style jsx> {`@import url(${importUrl})`} </style>
    <Stack direction="row" spacing={2}>
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      onChange={handleFontChange}
      options={nameFontOptions}
      getOptionSelected={(option, value) => option.value === value.value}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params}/>}
      />
      <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="small" {...controlAlign} aria-label="Small sizes">
        {childrenAlign}
      </ToggleButtonGroup>
      </Stack>
      <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="small" {...controlJustifyContent} aria-label="Small sizes">
        {childrenJustifyContent}
      </ToggleButtonGroup>
      </Stack>
      <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="small" {...controlFontWeight} aria-label="Small sizes">
        {childrenFontWeight}
      </ToggleButtonGroup>
      </Stack>
      <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="small" {...controlFontStyle} aria-label="Small sizes">
        {childrenFontStyle}
      </ToggleButtonGroup>
      </Stack>
      <Box sx={{ width: 300 }}>
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
      <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="small" {...controlTextTranform} aria-label="Small sizes">
        {childrenTextTranform}
      </ToggleButtonGroup>
      </Stack>
      <Select
      id="demo-select-small"
      value={fontSize}
      onChange={handleFontSizeChange}
      >
      <MenuItem value={8}>8px</MenuItem>
      <MenuItem value={12}>12px</MenuItem>
      <MenuItem value={16}>16px</MenuItem>
      <MenuItem value={20}>20px</MenuItem>
      <MenuItem value={40}>40px</MenuItem>
      </Select>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <p>Edit</p>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div className={styles.inputs}>
      <TextField id="outlined-basic" label="Event title" variant="outlined" onChange={handleInputEventTitleChange} value={eventTitle}/>
      <TextField id="outlined-multiline-static" label="Description" variant="outlined" multiline rows={4} onChange={handleInputEventLineUpChange} value={eventLineUp}/>
      <div className={styles.hour}>
        <TextField id="outlined-basic" label="Start time" variant="outlined" onChange={handleInputEventStartChange} value={eventStart}/>
        <TextField id="outlined-basic" label="End time" variant="outlined" onChange={handleInputEventEndChange} value={eventEnd}/> 
      </div>
      </div>
      </Menu>
      <ToggleButtonGroup size="small" {...controlFormat} aria-label="Small sizes">
        {childrenFormat}
      </ToggleButtonGroup>
    </Stack>
    <div>
      {values.map((value, index) => (
        <div key={index}>
          <input
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <button onClick={() => handleRemoveField(index)}>
            Supprimer
          </button>
        </div>
      ))}
      <button onClick={handleAddField}>
        Ajouter un champ
      </button>
    </div>
    <div style={zoomStyle}>
      <div className={styles.file} style={{ width: `${formatWidth}px`, height: `${formatHeight}px`, padding: `${padding}px`}}>
        <div className={styles.textContainer} style={{ justifyContent }}>
        {values.map((value, index) => (
    <p key={index} style={{ fontFamily, fontSize, textAlign, textTransform, fontWeight, fontStyle }}>
      {value}
    </p>
  ))}
        </div>
      </div>
    </div>
    <div className={styles.bottom}>
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
  )
}
