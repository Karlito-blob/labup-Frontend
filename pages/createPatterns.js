// Imports React
import React, { useState, useEffect, useRef } from 'react'

// Imports Material-UI
import { ChromePicker as ColorPicker } from 'react-color';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slider from '@mui/material/Slider';

// Import screenshot component
import { useScreenshot } from 'use-react-screenshot'
import html2canvas from 'html2canvas';


// Imports des composants
import Header from '../components/Header';
import VisualizationPattern from '../components/VisualizationPattern'
import PrimaryButton from '../components/Ui Kit/PrimaryButton';

function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 1;

export default function createPatterns() {

  // Gestion du screenshot
  const ref = useRef(null)
  const [screenshot, takeScreenshot] = useScreenshot()

  const handleTakeScreenshot = () => {
    console.log('Attempting to take a screenshot');
    html2canvas(ref.current)
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        console.log('Screenshot taken successfully:', imageData);
        takeScreenshot(ref.current);
      }).catch((error) => {
        console.error('Error during screenshot capture:', error);
      });
  };



  // Récupération des paramètres initiaux du Pattern
  const [value, setValue] = useState([0, 10]);
  const [params, setParams] = useState([]);

  // Récupération des paramètres modifiés du Pattern
  const [modifiedParams, setModifiedParams] = useState([])

  // Track visibility state for each slider individually
  const [showSlider, setShowSlider] = useState({});

  useEffect(() => {

    // Récupération des paramètres du Pattern
    fetch('http://localhost:3000/initialPatterns/')
      .then(response => response.json())
      .then(data => {

        if (data.result) {

          const newParams = data.InitialPatterns[0].params.map((params, i) => {

            if (params.paramType === 'Slider') {

              // Gestion du slider simple
              const handleSimpleSlider = (event, newValue, paramName) => {
                setModifiedParams((prevParams) => {
                  const updatedParams = { ...prevParams };
                  updatedParams[paramName] = newValue;

                  return updatedParams;
                });

              };

              return ( // Retour d'un slider simple 
                <div key={params.paramName + i} style={{ padding: 30, color: 'white' }}>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                    {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>


                  {showSlider[params.paramName] &&
                    <Slider
                      key={i}
                      aria-label="Default"
                      step={0.1}
                      min={params.valeurMinMax[0]}
                      max={params.valeurMinMax[1]}
                      value={modifiedParams[params.paramName]}
                      valueLabelDisplay="auto"
                      defaultValue={0} // Changez la valeur par défaut
                      onChange={(event, newValue) => handleSimpleSlider(event, newValue, params.paramName)}
                    />}

                </div>
              );


            } else if (params.paramType === 'DoubleSlider') {

              // Gestion du double slider 
              const handleDoubleSlider = (event, newValue, activeThumb, paramName) => {
                if (!Array.isArray(newValue)) {
                  return;
                }

                if (newValue[1] - newValue[0] < minDistance) {
                  if (activeThumb === 0) {
                    const clamped = Math.min(newValue[0], 100 - minDistance);
                    setValue([clamped, clamped + minDistance]);
                  } else {
                    const clamped = Math.max(newValue[1], minDistance);
                    setValue([clamped - minDistance, clamped]);
                  }
                } else {
                  setValue(newValue);
                }

                // Mettez à jour modifiedParams ici pour inclure les valeurs des sliders doubles
                setModifiedParams((prevParams) => {
                  const updatedParams = { ...prevParams };
                  updatedParams[paramName] = newValue;
                  return updatedParams;
                });
              };

              return (
                <div key={params.paramName + i} style={{ padding: 30, color: 'white' }}>
                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                    {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                  </div>

                  {showSlider[params.paramName] && <Slider
                    key={i}
                    getAriaLabel={() => 'Minimum distance shift'}
                    value={modifiedParams[params.paramName] || params.valeurMinMax} // Valeur par défaut en cas de valeur non définie
                    onChange={(event, newValue, activeThumb) => handleDoubleSlider(event, newValue, activeThumb, params.paramName)}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    disableSwap
                    step={0.1}
                  />}

                </div>
              )

            } else if (params.paramType === 'Color') {

              // Gestion du picker de couleur
              const handleColor = (color, paramName) => {
                setModifiedParams((prevParams) => {
                  const updatedParams = { ...prevParams };
                  updatedParams[paramName] = color.rgb;
                  return updatedParams;
                });
              };

              return (
                <div key={params.paramName + i} style={{ padding: 30, color: 'white' }}>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                    {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>


                  {showSlider[params.paramName] &&
                    <ColorPicker
                      key={i}
                      color={modifiedParams[params.paramName]} // Valeur par défaut en cas de couleur non définie
                      onChangeComplete={(color) => handleColor(color, params.paramName)}
                      style={{ alignSelf: 'center' }}
                    />}
                </div>
              );
            }

          });

          setParams(newParams);
        }
      });
  }, [modifiedParams, showSlider]);


  return (
    <>
      <Header />

      <div style={{ display: "flex" }}>
        <div style={{ width: '35vw', height: '93.5vh', padding: '20px', backgroundColor: 'black', overflowX: 'auto', gap: '16px' }} >
          <div onClick={handleTakeScreenshot}>
            <PrimaryButton content='Take ScreenShot' />
          </div>

          {params}
        </div >
        <div style={{ width: '65vw', height: '93.5vh', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
          <div style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)' }} ref={ref} >
            <VisualizationPattern modifiedParams={modifiedParams} />
          </div>

          {screenshot && (
            <div style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)', margin: '10px' }}>
              <img src={screenshot} alt="screenshot" style={{ width: '100px', height: '100px' }} />
            </div>
          )}


        </div>
      </div>

    </>

  );
}