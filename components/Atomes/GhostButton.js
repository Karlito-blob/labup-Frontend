import React from 'react'
import Button from '@mui/material/Button';

export default function GhostButton(props) {
  return (
    <Button variant="text">{props.text}</Button>
  )
}