import React from 'react'
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded'
import { IconButton, Tooltip } from '@mui/material'

export default function Help() {
  return (
    <Tooltip title="Help" arrow>
    <IconButton aria-label="help">
      <QuestionMarkRoundedIcon />
    </IconButton>
  </Tooltip>
  )
}
