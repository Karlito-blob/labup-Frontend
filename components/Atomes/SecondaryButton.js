import React from 'react';
import Button from '@mui/material/Button';

export default function SecondaryButton(props) {
  return (
    <Button variant="outlined" onClick={props.onClick}>{props.text}</Button>
  )
}
