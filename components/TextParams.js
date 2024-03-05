import React, { useEffect, useState } from 'react';
import Header from './Header';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import styles from '../styles/CreateFile.module.css';


export default function TextParams(props) {

  const [eventTitle, setEventTitle] = useState('');
  const [eventLineUp, setEventLineUp] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [fontSize, setFontSize] = useState(30);
  const [fontPositionX, setFontPositionX] = useState(30);

  const [fontData, setFontData] = useState([]);
  const [selectedFont, setSelectedFont] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/fonts')
      .then(response => response.json())
      .then(data => {
        console.log(data)
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

  const handleFontChange = (event) => {
    setSelectedFont(event.target.textContent || '');
  };
  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };
  const handleFontPositionXChange = (event, newValue) => {
    setFontPositionX(newValue);
  };
  
  useEffect(() => {
    console.log('Selected Font Data:', selectedFont);
  }, [selectedFont]);


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

  console.log("selected font => ", selectedFont);
  console.log("selected split => ", selectedFont.split(" ").join("+"));

  const importUrl = `https://fonts.googleapis.com/css2?family=${selectedFont.split(" ").join("+")}&display=swap`
  console.log(importUrl)

  return (
    <div className={styles.viewport}>
      <Header/>
      <div className={styles.container}>
        <div className={styles.boxParams}>
          <h4>Create your event</h4>
          <div className={styles.inputs}>
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            onChange={handleFontChange}
            options={nameFontOptions}
            getOptionSelected={(option, value) => option.value === value.value}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select your font" />}
            />
            <Slider
              aria-label="Font Size"
              value={fontSize}
              onChange={handleFontSizeChange}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={110}
            />
            <Slider
              aria-label="Position X"
              value={fontPositionX}
              onChange={handleFontPositionXChange}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={0}
              max={750}
            />
            <TextField id="outlined-basic" label="Event title" variant="outlined" onChange={handleInputEventTitleChange} value={eventTitle}/>
            <TextField id="outlined-multiline-static" label="Description" variant="outlined" multiline rows={4} onChange={handleInputEventLineUpChange} value={eventLineUp}/>
            <div className={styles.hour}>
              <TextField id="outlined-basic" label="Start time" variant="outlined" onChange={handleInputEventStartChange} value={eventStart}/>
              <TextField id="outlined-basic" label="End time" variant="outlined" onChange={handleInputEventEndChange} value={eventEnd}/> 
            </div>
          </div>
        </div>
        <div className={styles.canvas}>
          <style jsx>
             {`@import url(${importUrl})`}
         </style>
         <div className={styles.file}>
          <p style={{ fontFamily: selectedFont, fontSize: fontSize, top: fontPositionX }}>{eventTitle}</p>
          <p style={{ fontFamily: selectedFont }}>{eventLineUp}</p>
          <p style={{ fontFamily: selectedFont }}>{eventStart}</p>
          <p style={{ fontFamily: selectedFont }}>{eventEnd}</p>
         </div>
        </div>
      </div>
    </div>
  )
}
