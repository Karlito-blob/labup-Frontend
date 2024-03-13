import React from 'react';
import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import AvatarMUI from '@mui/material/Avatar';

export default function Avatar() {

    const user = useSelector(((state) => state.user.value))
    function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
    }
    function stringAvatar(name) {
    return {
        sx: {
        bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
        };
    }

    return (
        <Stack direction='row'>
            <AvatarMUI {...stringAvatar(user.userName)} sx={{ width: 32, height: 32 }} />
        </Stack>
    )
}