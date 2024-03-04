import styles from '../styles/Home.module.css';

import React, { useRef, useState } from 'react'
import { useScreenshot } from 'use-react-screenshot'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import '@fontsource/roboto/300.css'; 



function Home() {

  const ref = useRef(null)
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(ref.current)

  return (
    <div ref={ref}>
      <main className={styles.main}>

        <button onClick={getImage}>
          Take screenshot
        </button>
        <Box sx={{ width: 300 }}>

          <Slider
            size="small"
            defaultValue={70}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
        </Box>
        <img width={'1000px'} src={image} alt={'Screenshot'} />
      </main>

    </div>
  );
}

export default Home;
