import React from 'react'
import styles from '../../styles/UiKit.module.css';
import ds from '../../styles/DesignSystem.module.css';

export default function PrimaryButton(props) {
  return (
    <button className={styles.buttonPrimary}><p className={ds.mediumBodySB}>Coucou</p></button>
  )
}