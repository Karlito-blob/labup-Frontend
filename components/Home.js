import React from 'react';
import Header from './Header';
import PrimaryButton from './Ui Kit/PrimaryButton';
import Input from './Ui Kit/Input';
import styles from '../styles/Home.module.css';
import ds from '../styles/DesignSystem.module.css';

function Home() {
  return (
    <div className={styles.heroSection}>
      <Header/>
      <div className={styles.container}>
        <h1 className={ds.largeDisplay}>Express yourself</h1>
        <p>Une expérience visuelle unique pour vos événements.</p>
        <PrimaryButton/>
        <Input/>
      </div>
    </div>
  );
}

export default Home;
