import Header from './Header';
import SignUp from './Connexion/SignUp';
import SignIn from './Connexion/SignIn';
import PrimaryButton from './Ui Kit/PrimaryButton';
import Input from './Ui Kit/Input';
import styles from '../styles/Home.module.css';

import React, { useRef, useState } from 'react'
import { useScreenshot } from 'use-react-screenshot'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import '@fontsource/roboto/300.css'; 
import { useSelector } from 'react-redux';



function Home() {

  const ref = useRef(null)
  const [image, takeScreenshot] = useScreenshot()
  const getImage = () => takeScreenshot(ref.current)
  const user = useSelector((state) => state.user.value);

  return (
    <div>
      <Header />
    </div>
  );
}

export default Home;
