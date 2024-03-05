import React from 'react'
import Header from './Header'
import { useSelector } from 'react-redux'

import styles from '../styles/Dashboard.module.css';
import { Button } from '@mui/material';

export default function Dashboard(props) {

  const patternData = [
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    },
    {
      image: 'background.jpg',
      title: 'Expérience 1',
      update: 'Viewed 3 days ago'
    }
  ]

  const pattern = patternData.map((pattern, index) => (
    <div key={index} className={styles.pattern}>
      <div className={styles.imgContainer}>
        <img src={pattern.image} alt={pattern.title} />   
      </div>
      <h5>{pattern.title}</h5>
      <p>{pattern.update}</p>
    </div>
  ))

  return (
    <div className={styles.container}>
      <Header/>
      <div className={styles.box}>
        <h2>Dasboard</h2>
        <div className={styles.buttonsContainer}>
          <Button onClick={() => router.push('/createPatterns')}>Pattern File</Button>
          <Button onClick={() => router.push('/createFile')}>Event File</Button>
        </div>
      </div>
      <div>
        <div className={styles.patternSection}>
          <h3>My patterns</h3>
          <div className={styles.wrapScrollH}>
            <div className={styles.patternsContainer}>
              {pattern}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}