import React from 'react'
import Button from '@mui/material/Button';

export default function PrimaryButton(props) {
  return (
    <Button variant="contained" onClick={props.onClick}>{props.text}</Button>
  )
}