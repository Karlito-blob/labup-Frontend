// Imports React
import React, { useState, useEffect, useRef } from 'react'

// Imports Material-UI
import { ChromePicker as ColorPicker } from 'react-color';
import Slider from '@mui/material/Slider';

// Import icons 
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ViewHeadlineRoundedIcon from '@mui/icons-material/ViewHeadlineRounded';
import PatternRoundedIcon from '@mui/icons-material/PatternRounded';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';

// Import screenshot component
import { useScreenshot } from 'use-react-screenshot'
import html2canvas from 'html2canvas';
const b64toBlob = require('b64-to-blob');

// Imports des composants
import Header from '../components/Header';
import VisualizationPattern from '../components/VisualizationPattern'
import PrimaryButton from '../components/Ui Kit/PrimaryButton';

function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 1;

export default function createPatterns() {

  // Gestion des screenshots
  const ref = useRef(null)
  const [images, setImages] = useState([])

  console.log({ images });

  const handleTakeScreenshot = () => {
    console.log('Ref current:', ref.current);

    if (ref.current) {
      html2canvas(ref.current)
        .then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          console.log('Screenshot taken successfully:', imageData);
          setImages((prevImages) => [...prevImages, imageData]);
          console.log('Updated images:', images); // Ajout de cette ligne pour vérifier le contenu du tableau après la mise à jour

        })
        .catch((error) => {
          console.error('Error during screenshot capture:', error);
        });
    } else {
      console.error('Ref current is null. Make sure the ref is correctly assigned.');
    }

  };

  // Mapping des screenshots 
  const handleDeleteScreenshot = (url) => {
    setImages(images.filter((el) => el !== url));
  };

  const screenshots = images.map((img, index) => {
    return (
      <div key={index} style={{ position: 'relative' }}>
        <img key={index} src={img} alt={`screenshot-${index}`} style={{ width: '230px', height: '230px', borderRadius: '10px', margin: '16px' }} />
        <button
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius:'10px', 
          }}
          onClick={() => setImages(images.filter((el) => el !== img))}
        >
          X
        </button>
      </div>
    );
  });

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul)
  


  const handleExport = async () => {
    const token = "9yTfuzQ9WrJ9gppxz8TRtivt5dPRMjMz"
    const initialPattern = "65e5fb2a8e69e1507d663e6f"
    const patternName = "pattern1"
    const paramsModif = {}
    const fileName = "test001"
    const formData = new FormData()
    console.log(images)
    /*
    
    formData.append("photoFromFront", {
      url: images,
      name: 'photo.png',
      type: 'image/png',
    })
    const imageData = images.toString()
    */
    const temp = images.toString();
    const imageData = temp.split(',')[1];
    
    const blob = b64toBlob(imageData, 'image/png');
    const file = new File([blob], 'photo.png', { type: 'image/png' });
    formData.append("photoFromFront", file);
    formData.append("token", token);
    formData.append("initialPattern", initialPattern);
    formData.append("patternName", patternName);
    formData.append("paramsModif", paramsModif);
    formData.append("fileName", fileName);

    console.log(temp, imageData, blob, file, formData)
    
    fetch("http://localhost:3000/modifiedPatterns/", {
      method: 'POST',
      /*
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, initialPattern: initialPattern, patternName: patternName, paramsModif: paramsModif, fileName: fileName, formData}),
      */
      body: formData,
    })
    
    .then(res => res.json())
    .then(data => {
      console.log("TEST THEO", data)
    })
  }


  // Navigation bar 
  const [navigation, setNavigation] = useState('Pattern')
  const [showNavigation, setShowNavigation] = useState(false)
  const [screenSize, setScreenSize] = useState('95vw')

  const handleNavigation = (onglet) => {
    setNavigation(onglet)
    setShowNavigation(true)
    setScreenSize('65vw')
  }

  const showPanel = () => {
    setShowNavigation(!showNavigation)
    setScreenSize('95vw')
  }

  // Récupération des paramètres initiaux du Pattern
  const [params, setParams] = useState([]);
  const [value, setValue] = useState([0, 10]);


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
                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
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
                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
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
                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.paramName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
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
  }, [modifiedParams, showSlider, images]);


  return (
    <>
      <Header />

      <div style={{ display: "flex", flexDirection: 'row' }}>

        {/* Navigation bar icons  */}
        <div style={{ color: 'white', display: "flex", alignItems: 'center', flexDirection: 'column', backgroundColor: 'black', gap: '16px', padding: '16px', cursor: 'pointer' }}>
          <PatternRoundedIcon onClick={() => handleNavigation('Pattern')} style={{ fontSize: '50px', border: navigation === 'Pattern' ? 'solid 1px' : 'solid 0px', borderRadius: '10px' }} />
          <ViewHeadlineRoundedIcon onClick={() => handleNavigation('Params')} style={{ fontSize: '50px', border: navigation === 'Params' ? 'solid 1px' : 'solid 0px', borderRadius: '10px' }} />
          <AddPhotoAlternateIcon onClick={() => handleNavigation('Screens')} style={{ fontSize: '50px', border: navigation === 'Screens' ? 'solid 1px' : 'solid 0px', borderRadius: '10px' }} />
        </div>

        {showNavigation && <div style={{ width: '35vw', height: '93.5vh', padding: '20px', backgroundColor: 'black', overflowX: 'auto', gap: '16px' }}>

          {navigation === 'Pattern' && <></>}

          {navigation === 'Params' &&
            <div>
              <h1 style={{ color: 'white' }}> Paramètres</h1>
              {params}
            </div>
          }

          {navigation === 'Screens' &&
            <div >
              <h1 style={{ color: 'white' }}> Screenshots </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {screenshots}
              </div>
              <button style={{width: "100px", height: "100px"}} onClick={() => handleExport()}>EXPORT</button>
            </div>
          }

        </div >}

        {/* Navigation bar  */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showNavigation ?
            <KeyboardArrowLeftIcon
              style={{ color: 'white', height: '80px', backgroundColor: 'black', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
              onClick={() => showPanel()}
            />
            :
            <KeyboardArrowRightIcon
              style={{ color: 'white', height: '80px', backgroundColor: 'black', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
              onClick={() => showPanel()}
            />}
        </div>


        {/* Zone de visualisation */}
        <div style={{ width: screenSize, height: '93.5vh', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)', }} ref={ref} >
            <VisualizationPattern modifiedParams={modifiedParams} />
          </div>
          <div
            onClick={() => handleTakeScreenshot()}
            style={{
              display: 'flex',
              position: 'absolute',
              cursor: 'pointer',
              bottom: '80px',
              right: '80px',
              justifyContent: 'center',
              alignItems: 'center',
              width: '50px',
              height: '50px',
              padding: '20px',
              borderRadius: '100px',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',

            }}
          >
            <CameraRoundedIcon />
          </div>

        </div>
      </div>

    </>

  );
}