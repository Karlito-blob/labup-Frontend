import React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useRouter } from 'next/router';


import Stack from '@mui/material/Stack';
import AvatarMUI from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import LogOut from '../Connexion/Logout';
import DeleteAccount from '../Connexion/Delete';
import PrimaryButton from './PrimaryButton';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

export default function Avatar() {

    const router = useRouter()

    const user = useSelector((state) => state.user.value);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Modifié pour accepter l'événement et utiliser event.currentTarget
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let headerContent;
    if (user.token) {
        // Display username if the user is connected
        headerContent = (
            <div>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <AvatarMUI {...stringAvatar(user.userName)} sx={{ width: 40, height: 40 }} />
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem><LogOut /></MenuItem>
                    <MenuItem><DeleteAccount /></MenuItem>
                </Menu>
            </div>
        )
    } else {
        // Display sign in and sign up buttons if the user is not connected
        headerContent = (

            <div>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <AvatarMUI sx={{ width: 40, height: 40 }} />
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>
                        <Button onClick={() => router.push('/signIn')}>Sign in</Button>
                    </MenuItem>
                    <MenuItem>
                        <Button onClick={() => router.push('/signUp')}>Sign up</Button>
                    </MenuItem>

                </Menu>
            </div>
        );
    }

    function stringToColor(string) {
        let hash = 0;

        let i;
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
            sx: { bgcolor: stringToColor(name), },
            children: `${name.split(' ')[0][0]}`,
        }
    }

    return (
        <Stack direction='row'>
            {headerContent}
        </Stack>
    )
}