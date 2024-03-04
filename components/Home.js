import React from 'react';
import Header from './Header';
import PrimaryButton from './Ui Kit/PrimaryButton';
import Input from './Ui Kit/Input';
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
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
}

export default Home;
