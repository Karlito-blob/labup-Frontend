import React from 'react';
import Button from '@mui/material/Button';

export default function SecondaryButton(props) {
  return (
    <Button variant="outlined">{props.text}</Button>
  )
}
