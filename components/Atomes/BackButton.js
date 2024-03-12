import React from 'react'
import { useRouter } from 'next/router';

import IconButton from '@mui/material/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

export default function BackButton() {
    const router = useRouter();

    return (
        <IconButton aria-label="back" size="large" onClick={() => router.push('/dashboard')}>
            <ArrowBackRoundedIcon />
        </IconButton>
    )
}