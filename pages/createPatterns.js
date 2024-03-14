// Imports React + redux
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

// Style 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '../styles/CreatePattern.module.css';
import styles2 from '../styles/CreateFile.module.css';
import ds from '../styles/DesignSystem.module.css';

// Import des modules 
import { takeScreenshot } from '../modules/screenshotUtils';
import { randomParams } from '../modules/randomisationUtils';
import { createGIF } from 'gifshot';
import ProgressBarComponent from '../components/Atomes/ProgressCircle';

// Imports Material-UI
import { ChromePicker as ColorPicker } from 'react-color';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';

// Import icons 
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
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
  TryRounded,

} from '@mui/icons-material';
import GifIcon from '@mui/icons-material/Gif';

// Transfert des data vers cloudinary 
const b64toBlob = require('b64-to-blob');
import axios from 'axios';

// Imports des composants
import Header from '../components/Header';
import VisualizationPattern from '../components/VisualizationPattern'
import { Divider, IconButton, Stack } from '@mui/material';


///////////////////////////////////////////////////////////////////////

export default function createPatterns() {
  // Reducer - token 
  const token = useSelector((state) => state.user.value.token);
  const router = useRouter();
  const { id } = router.query; // `id` est le nom du paramètre dynamique dans l'URL

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
  const [progress, setProgress] = useState(0);

  const user = useSelector((state) => state.value)

  // Navigation 
  const [navigation, setNavigation] = useState('Pattern')
  const [showNavigation, setShowNavigation] = useState(true)

  // Récupération des paramètres initiaux du Pattern
  const [params, setParams] = useState([]);
  const [value, setValue] = useState([0, 10]);

  // Récupération des paramètres initiaux et modifiés du Pattern 
  const [initialParams, setInitialParams] = useState(null)
  const [modifiedParams, setModifiedParams] = useState(null);

  // Track visibility state for each slider individually
  const [showSlider, setShowSlider] = useState({});

  // Gestion du titre du document
  const [title, setTitle] = useState('Untitled')

  // Fonction pour gérer la mise à jour du titre
  const handleSetTitle = (newTitle) => {
    if (newTitle) {
      setTitle(newTitle);
    } else {
      setTitle('Untitled');
    }
  };

  // Fonctions ////////////////////////////////////////////////////////////////////
  // Screenshot 
  const handleTakeScreenshot = async () => {
    try {
      const screenshot = await takeScreenshot(ref); // Assurez-vous que cette fonction retourne l'image en base64 ou une URL de l'image
      const fileName = `${title}-${patternName}`; // Nom de fichier généré pour l'image


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
      setActiveTitle('ScreenShots')

    } catch (error) {
      console.error("Erreur lors de la prise de la capture d'écran:", error);
    }
  };

  // Generate a gif 
  const handleCreateGif = async (setProgress) => {
    // Initialisation de la progression
    setProgress(0);

    const fileName = `${title}_${patternName}`; // Nom de fichier généré pour l'image
    console.log(fileName)

    const totalFrames = 25;
    const frameInterval = 40; // Temps en millisecondes
    let frames = [];
    const progressPerFrame = 100 / totalFrames; // Calcul de la progression par frame

    // Capture des frames
    for (let i = 0; i < totalFrames; i++) {
      // Ajout d'un délai avant de capturer chaque frame
      await new Promise(resolve => setTimeout(resolve, frameInterval));
      const frame = await takeScreenshot(ref);
      frames.push(frame);
      setProgress((prevProgress) => prevProgress + progressPerFrame); // Mise à jour de la progression
    }

    const options = {
      images: frames,
      gifWidth: 800,
      gifHeight: 800,
      numWorkers: 5,
      frameDuration: 0.01,
      sampleInterval: 40,
    };

    createGIF(options, (obj) => {
      if (!obj.error) {
        setImages(prevImages => [
          ...prevImages,
          {
            screenshot: obj.image,
            token,
            patternID,
            patternName,
            paramsModif: modifiedParams,
            fileName
          }
        ]);
        setProgress(100); // Assurez-vous que la progression est complète
      }
    });


  };

  //Export des screeshots
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
      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '8px' }}>
        {pattern.patternLabel}

        <img src={`${pattern.patternName}.png`} className={styles.patternCard} onClick={() => { handlePatternData(pattern._id, pattern.patternName) }} />
      </div>
    );
  });

  // Mapping des screenshots 
  const screenshots = images.map((img, index) => {
    return (
      <div key={index} style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px' }}>
          <img key={index} src={img.screenshot} alt={`screenshot-${index}`} className={styles.screenshotCard} onClick={() => setScreenshot(images[index].screenshot)} />
          {`${title}-${index + 1}`}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>

            <div
              className={styles.screenshotIcons}
              onClick={() => setImages(images.filter((el) => el !== img))}>
              <CloseRoundedIcon style={{ fontSize: '16px' }}
              />
            </div>

            <div
              className={styles.screenshotIcons}

              onClick={() => handleExport(index, img)}>
              <IosShareRoundedIcon style={{ fontSize: '16px' }}
              />
            </div>

          </div>

        </div>



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

    if (!id) {
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
    } else {

      //Fetch les modified patterns
      // Récupération des paramètres du Pattern

      fetch(`http://localhost:3000/modifiedPatterns/one/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.result) {

            setPatternID(data.ModifiedPattern.initialPattern._id)
            console.log(data.ModifiedPattern.initialPattern)

            const { ModifiedPattern } = data;
            const initialParamsList = ModifiedPattern.initialPattern.params;

            // Initialisez showSlider avec toutes les clés à true
            const initialShowSliderState = {};
            initialParamsList.forEach(param => {
              initialShowSliderState[param.paramName] = true;
            });

            // Mise à jour des paramètres modifiés à partir des données récupérées
            const initialParamsData = ModifiedPattern.paramsModif.reduce((acc, param) => {
              return { ...acc, ...param };
            }, {});


            // Mettez à jour l'état showSlider avec le nouvel objet
            setShowSlider(initialShowSliderState);

            setModifiedParams(initialParamsData);
            setPatternName(ModifiedPattern.patternName);

          }
        })
        .catch(error => console.log(error));
    }


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
                <div key={params.paramName + i} className={styles.paramCard}>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
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
                <div key={params.paramName + i} className={styles.paramCard}>
                  <div className={styles.line}></div>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
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
                <div key={params.paramName + i} className={styles.paramCard}>
                  <div className={styles.line}></div>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {params.displayName}
                      {showSlider[params.paramName] ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
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

              console.log('initial=>', initialParams, 'modified=>', modifiedParams)


              return (
                <div key={params.paramName + i} className={styles.toggleCard}>

                  <div onClick={() => setShowSlider(prevState => ({ ...prevState, [params.paramName]: !prevState[params.paramName] }))} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex' }}>
                      {params.displayName}
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

  // Rendu JSX /////////////////////////////////////////////////////
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }} className={styles2.viewport}>

        <Header chemin={router.pathname} setTitle={handleSetTitle} />

        <div className={styles.container} style={{ marginTop: '100px' }}>

          <div className={styles.leftPanel}>

            {/* Zone de screenshot */}
            <div className={styles.screenshotPanel}>
              <div className={styles.screenshotTitle}>
                <p className={ds.smallHeading}>
                  ScreenShots
                </p>
                {patternName && <div style={{ display: 'flex', gap: '8px', marginRight: '16px' }}>
                  {screenshot ?
                    <div onClick={() => setScreenshot('')} className={styles.rightIcons} >
                      <CloseRoundedIcon />
                    </div>
                    :
                    <Stack direction='row' alignItems='center'>
                      <IconButton aria-label="fingerprint" onClick={() => handleTakeScreenshot()}>
                        <CameraRoundedIcon />
                      </IconButton>
                      <IconButton aria-label="fingerprint" onClick={() => handleCreateGif()}>
                        <GifIcon />
                      </IconButton>
                    </Stack>

                  }

                </div>}

              </div>


              <div className={styles.screenCardList}>
                {screenshots}
              </div>
            </div>

            {/* Zone de choix du pattern */}
            <div className={styles.patternPanel}>
              <p className={ds.smallHeading}>
                Pattern
              </p>
              <div className={styles.patternCardList}>
                {patternsData}
              </div>
            </div>

          </div>

          {/* Zone de visualisation */}
          <div className={styles.visualisationPanel}>
            <div className={styles.visualisationCanva} style={{ scale: `${zoom}` }} ref={ref}  >
              {screenshot ?
                <img src={screenshot} style={{ width: '800px', height: '800px' }} />
                : <VisualizationPattern initialParams={initialParams} modifiedParams={modifiedParams} pattern={patternName} />
              }
            </div>

          </div>

          {/* Zone de paramètres */}
          {patternName && <div className={styles.paramPanel}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '12px' }}>

              <p className={ds.smallHeading}>Settings</p>

              <div>
                <div className={styles.rightIconsContainer}>
                  <div onClick={() => setZoom((prevZoom) => zoom <= 0.20 ? 1 : prevZoom - 0.10)} className={styles.rightIcons} >
                    <RemoveRoundedIcon />
                  </div>
                  <div onClick={() => setZoom((prevZoom) => zoom >= 1 ? 1 : prevZoom + 0.10)} className={styles.rightIcons} >
                    <AddRoundedIcon />
                  </div>
                  <div onClick={() => expandAllParams()} className={styles.rightIcons}>
                    <UnfoldMoreRoundedIcon />
                  </div>
                  <div onClick={() => handleRandomParams()} className={styles.rightIcons}>
                    <ShuffleRoundedIcon />
                  </div>
                </div>
              </div>

            </div>


            <div className={styles.params}>
              <Divider />
              {params}
            </div>
          </div>}


        </div>

      </div>
    </ThemeProvider>


  );

}