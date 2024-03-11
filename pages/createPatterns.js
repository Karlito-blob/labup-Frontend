// Imports React + redux
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { HotKeys } from 'react-hotkeys';

// Style 
import styles from '../styles/CreatePattern.module.css';

// Import des modules 
import { takeScreenshot } from '../modules/screenshotUtils';
import { createGifFromDiv } from '../modules/gifCreationUtils';
import { randomParams } from '../modules/randomisationUtils';

// Imports Material-UI
import { ChromePicker as ColorPicker } from 'react-color';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';

// Import icons 
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  ViewHeadlineRounded as ViewHeadlineRoundedIcon,
  PatternRounded as PatternRoundedIcon,
  CameraRounded as CameraRoundedIcon,
  AddRounded as AddRoundedIcon,
  RemoveRounded as RemoveRoundedIcon,
  ShuffleRounded as ShuffleRoundedIcon,
  CloseRounded as CloseRoundedIcon,
  UnfoldMoreRounded as UnfoldMoreRoundedIcon,
  IosShareRounded as IosShareRoundedIcon,

} from '@mui/icons-material';
import GifIcon from '@mui/icons-material/Gif';

// Transfert des data vers cloudinary 
const b64toBlob = require('b64-to-blob');
import axios from 'axios';

// Imports des composants
import Header from '../components/Header';
import VisualizationPattern from '../components/VisualizationPattern'


///////////////////////////////////////////////////////////////////////

export default function createPatterns() {
  const token = useSelector((state) => state.user.value.token); // Remplacer par le token réel
  // Choix du pattern 
  const [patterns, setPatterns] = useState([]);
  const [patternID, setPatternID] = useState('65e5fb2a8e69e1507d663e6f')
  const [patternName, setPatternName] = useState('')

  // Gestion du zoom 
  const [zoom, setZoom] = useState(1)

  // Gestion des screenshots
  const ref = useRef(null)
  const [images, setImages] = useState([]) 
  const [screenshot, setScreenshot] = useState('')

  // Navigation 
  const [navigation, setNavigation] = useState('Pattern')
  const [showNavigation, setShowNavigation] = useState(true)
  const [screenSize, setScreenSize] = useState('')

  // Récupération des paramètres initiaux du Pattern
  const [params, setParams] = useState([]);
  const [value, setValue] = useState([0, 10]);

  // Récupération des paramètres initiaux et modifiés du Pattern 
  const [initialParams, setInitialParams] = useState(null)
  const [modifiedParams, setModifiedParams] = useState(null);

  // Track visibility state for each slider individually
  const [showSlider, setShowSlider] = useState({});

  // Fonctions ////////////////////////////////////////////////////////////////////

  // Screenshot 
  const handleTakeScreenshot = async () => {
    try {
      const screenshot = await takeScreenshot(ref); // Assurez-vous que cette fonction retourne l'image en base64 ou une URL de l'image
      const fileName = `screenshot_${patternName}`; // Nom de fichier généré pour l'image

      // Mettre à jour le state images avec les nouvelles données
      setImages(prevImages => [
        ...prevImages,
        {
          screenshot, // Ou stocker l'URL de l'image si vous ne stockez pas directement les données de l'image
          token,
          patternID,
          patternName,
          paramsModif: modifiedParams, // Assurez-vous que cette variable contient les derniers paramètres modifiés
          fileName
        }
      ]);
    } catch (error) {
      console.error("Erreur lors de la prise de la capture d'écran:", error);
    }
  };

  // Generate a gif 
  const handleCreateGif = () => {
    createGifFromDiv(ref, setImages, 25, 40); // Pour un GIF de 1 seconde à 25fps
  };

  //{TETEY} envoie des screenshots vers le back ROUTE POST (pour le moment un seul screenshot)
  const handleExport = async (index, img) => {

    //constantes de simulation en attendant l'intéractivité totale de la page 
    const formData = new FormData()

    //recupere uniquement la partie base 64 du resultat de use react screen
    const imageData = images[index].screenshot.toString().split(',')[1];

    //transformation en blob pour moins transfert
    const blob = b64toBlob(imageData, 'image/png');

    //transformation en file avant intégration au formData
    const file = new File([blob], 'photo.png', { type: 'image/png' });

    //construction du formData avec un file et des champs de texte (A FACTORISER MAIS FLEMME TOUT DE SUITE)
    formData.append("photoFromFront", file);
    formData.append("token", token);
    formData.append("initialPattern", images[index].patternID);
    formData.append("patternName", images[index].patternName);
    formData.append("paramsModif", JSON.stringify(images[index].paramsModif));
    formData.append("fileName", images[index].fileName);

    //utilisation de axios pour la requete en multiple formData CAR FETCH CEST NUL A *****
    axios.post("http://localhost:3000/modifiedPatterns/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log("Scrennshot envoyé :", res)
        setImages(images.filter((el) => el !== img))
      })
      .catch(error => console.log(error))
  }

  // Navigation  
  const handleNavigation = (onglet) => {
    setNavigation(onglet)
    setShowNavigation(true)
    setScreenSize('75vw')
  }

  // Panneau de paramètres 
  const showPanel = () => {
    setShowNavigation(!showNavigation)
    setScreenSize('95vw')
  }
  // Randomisation des paramètres 
  const handleRandomParams = () => {
    randomParams(setModifiedParams, patternID);
  };

  // Expand All parameters 
  const expandAllParams = () => {
    // Vérifier si au moins un élément est actuellement ouvert
    const isAnyOpen = Object.values(showSlider).some(value => value);

    // Mettre à jour chaque clé avec la valeur inverse de isAnyOpen
    const updatedShowSlider = {};
    Object.keys(showSlider).forEach(key => {
      updatedShowSlider[key] = !isAnyOpen;
    });

    // Mettre à jour l'état showSlider avec le nouvel objet
    setShowSlider(updatedShowSlider);
  }

  // Mapping des patterns 
  const patternsData = patterns.map((pattern, index) => {

    // console.log('patternID =>' ,pattern._id)
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'column', color: 'white', alignItems: 'center' }}>
        <img src={`${pattern.patternName}.png`} className={styles.patternCard} onClick={() => { handlePatternData(pattern._id, pattern.patternName) }} />
        {pattern.patternLabel}
      </div>
    );
  });

  // Mapping des screenshots 
  const screenshots = images.map((img, index) => {
    return (
      <div key={index} style={{ position: 'relative', color: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img key={index} src={img.screenshot} alt={`screenshot-${index}`} style={{ width: '120px', height: '120px', borderRadius: '10px', margin: '16px' }} onClick={() => setScreenshot(images[index].screenshot)} />
          {`screenshot-${index + 1}`}
        </div>

        <CloseRoundedIcon
          style={{ position: 'absolute', top: '0', right: '0', background: 'white', border: 'none', cursor: 'pointer', borderRadius: '30px', color: 'black' }}
          onClick={() => setImages(images.filter((el) => el !== img))}
        />

        <IosShareRoundedIcon
          style={{ position: 'absolute', top: '0', right: '30px', background: 'white', border: 'none', cursor: 'pointer', borderRadius: '30px', color: 'black' }}
          onClick={() => handleExport(index, img, 'constallation')}
        />

      </div>
    );
  });

  // Récupération des paramètres lors du clic sur un autre pattern 
  const handlePatternData = (id, name) => {

    fetch(`http://localhost:3000/initialPatterns/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {

          setInitialParams(null);
          setPatternID(id)
          setPatternName(name)

          const initialParamsList = data.InitialPattern.params;

          // Initialisez showSlider avec toutes les clés à true
          const initialShowSliderState = {};
          initialParamsList.forEach(param => {
            initialShowSliderState[param.paramName] = true;
          });

          // Mettez à jour l'état showSlider avec le nouvel objet
          setShowSlider(initialShowSliderState);

          // console.log("Result => ", data.InitialPatterns);
          const initialParamsData = data.InitialPattern.params.reduce((acc, param) => {
            acc[param.paramName] = param.valeurInitiale;
            return acc;
          }, {});

          // console.log('patternName =>', patternName)
          setInitialParams(initialParamsData);
          setModifiedParams(initialParamsData);

          handleNavigation('Params')
        }
      });
  }

  // UseEffects /////////////////////////////////////////////////////
  // UseEffect d'initialisation des patterns ////////////////////////
  useEffect(() => {
    // Récupération des paramètres du Pattern
    fetch(`http://localhost:3000/initialPatterns/`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {

          // Récupéreration des noms des patterns disponibles
          const patterns = data.InitialPatterns;
          // Mise à jour de la state avec les noms des patterns
          setPatterns(patterns);
        }
      });
  }, []);

  // UseEffect d'initialisation des paramètres //////////////////////
  useEffect(() => {

    // Récupération des paramètres du Pattern
    fetch(`http://localhost:3000/initialPatterns/${patternID}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          const initialParamsList = data.InitialPattern.params;

          // Initialisez showSlider avec toutes les clés à true
          const initialShowSliderState = {};
          initialParamsList.forEach(param => {
            initialShowSliderState[param.paramName] = true;
          });

          // Mettez à jour l'état showSlider avec le nouvel objet
          setShowSlider(initialShowSliderState);

          // console.log("Result => ", data.InitialPatterns);
          const initialParamsData = data.InitialPattern.params.reduce((acc, param) => {
            acc[param.paramName] = param.valeurInitiale;
            return acc;
          }, {});

          setInitialParams(initialParamsData);
        }
      });

  }, []);

  // UseEffect de modification /////////////////////////////////////
  useEffect(() => {

    // Récupération des paramètres du Pattern
    fetch(`http://localhost:3000/initialPatterns/${patternID}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {

          // setParams(null);

          //  Mapping des différents composants (slider / couleur / toggle) en fonction de la BDD 
          const newParams = data.InitialPattern.params.map((params, i) => {

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
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
                  </div>

                  {showSlider[params.paramName] &&
                    <Slider
                      key={i}
                      aria-label="Default"
                    step={params.step || 0.1}
                      min={params.valeurMinMax[0]}
                      max={params.valeurMinMax[1]}
                    value={modifiedParams ? modifiedParams[params.paramName] || params.valeurInitiale : params.valeurInitiale}
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

                const minDistance = 1;

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
                  <div className={styles.line}></div>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
                  </div>

                  {showSlider[params.paramName] &&
                    <Slider
                    key={i}
                    getAriaLabel={() => 'Minimum distance shift'}
                    value={modifiedParams ? modifiedParams[params.paramName] || params.valeurInitiale : params.valeurInitiale}
                    onChange={(event, newValue, activeThumb) => handleDoubleSlider(event, newValue, activeThumb, params.paramName)}
                    valueLabelDisplay="auto"
                      getAriaValueText={() => ''}
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
                  <div className={styles.line}></div>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
                  </div>

                  {showSlider[params.paramName] &&
                    <ColorPicker
                      key={i}
                    color={modifiedParams ? modifiedParams[params.paramName] || params.valeurInitiale : params.valeurInitiale}
                      onChangeComplete={(color) => handleColor(color, params.paramName)}
                      style={{ alignSelf: 'center' }}
                    />}

                </div>
              );
            } else if (params.paramType === 'Switch') {

              // Gestion du Switch
              const handleSwitch = (event, paramName) => {
                setModifiedParams((prevParams) => {
                  const updatedParams = { ...prevParams };
                  updatedParams[paramName] = event.target.checked;
                  return updatedParams;
                });
              };

              console.log(modifiedParams)

              return (
                <div key={params.paramName + i} style={{ padding: 30, color: 'white' }}>
                  <div className={styles.line}></div>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                    </div>
                  </div>

                  {showSlider[params.paramName] &&
                    <Switch
                      checked={modifiedParams ? modifiedParams[params.paramName] || params.valeurInitiale : params.valeurInitiale}
                      onChange={(event) => handleSwitch(event, params.paramName)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }

                </div>
              );
            }

          });

          // Configuration des paramètres dans le panneau de contrôle
          setParams(newParams);

        }
      });
  }, [modifiedParams, showSlider, images, zoom]);


  // Rendu JSX /////////////////////////////////////////////////////
  return (

    <>
      <Header />
      <div className={styles.container} >

        {/* Navigation bar icons  */}
        <div className={styles.navigationBarIcons}>
          <PatternRoundedIcon onClick={() => handleNavigation('Pattern')} className={styles.barIcons} style={{ border: navigation === 'Pattern' ? 'solid 1px' : 'solid 0px' }} />
          <ViewHeadlineRoundedIcon onClick={() => handleNavigation('Params')} className={styles.barIcons} style={{ border: navigation === 'Params' ? 'solid 1px' : 'solid 0px' }} />
          <AddPhotoAlternateIcon onClick={() => handleNavigation('Screens')} className={styles.barIcons} style={{ border: navigation === 'Screens' ? 'solid 1px' : 'solid 0px' }} />
        </div>

        {/* Navigation  */}
        {showNavigation && <div className={styles.navigationBar} >

          {navigation === 'Pattern' &&
            <>
              <h1 style={{ color: 'white' }}> Choose a pattern </h1>
              <div className={styles.patternBar}>
              {patternsData}
              </div>
            </>

          }

          {navigation === 'Params' && patternName &&
            <div>
              <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 > Settings </h1>
                <div >
                  <UnfoldMoreRoundedIcon onClick={() => expandAllParams()} style={{ fontSize: '36px', cursor: 'pointer' }} />
                  <ShuffleRoundedIcon onClick={() => handleRandomParams()} style={{ fontSize: '36px', cursor: 'pointer' }} />
                </div>
              </div>
              {params}
            </div>
          }

          {navigation === 'Screens' && patternName &&
            <div >
              <h1 style={{ color: 'white' }}> Screenshots </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {screenshots}
              </div>
              {/* <button style={{width: "100px", height: "100px"}} onClick={() => handleExport()}>EXPORT</button> */}
            </div>
          }

        </div >
        }

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
          <div style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)', scale: `${zoom}` }} ref={ref}  >
            {screenshot && initialParams ?
              <img src={screenshot} style={{ width: '800px', height: '800px' }} />
              : <VisualizationPattern initialParams={initialParams} modifiedParams={modifiedParams} pattern={patternName} />
            }
          </div>

          {patternName && <div className={styles.rightIconsContainer}>

            <div onClick={() => setZoom((prevZoom) => zoom <= 0.20 ? 1 : prevZoom - 0.10)} className={styles.rightIcons} >
              <RemoveRoundedIcon />
            </div>
            <div onClick={() => setZoom((prevZoom) => zoom >= 1 ? 1 : prevZoom + 0.10)} className={styles.rightIcons} >
              <AddRoundedIcon />
            </div>
            {screenshot ?
              <div onClick={() => setScreenshot('')} className={styles.rightIcons} >
                <CloseRoundedIcon />
              </div>
              :
              <div onClick={() => handleTakeScreenshot()} className={styles.rightIcons} >
                <CameraRoundedIcon />
              </div>
            }

            <div onClick={() => handleCreateGif()} className={styles.rightIcons} >
              <GifIcon />
            </div>
          </div>

          }

        </div>

      </div>

    </>

  );

}