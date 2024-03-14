import React from 'react';
import ds from '../styles/DesignSystem.module.css';
import bg from '../styles/CreateFile.module.css';

export default function OneScreen() {
  return (
    <div className={`${bg.viewport} ${bg.polka}`} style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
        <h1 className={ds.largeDisplay} style={{width: '60%', textAlign: 'center'}}>One model, your creativity, infinite possibilities!</h1>
    </div>
  )
}
