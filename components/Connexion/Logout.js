import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/user';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

export default function LogOut() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(logout())
    router.push('/')
  }
  
  return (
    <div>
      <Button onClick={handleClick}>Logout</Button>
    </div>
  );
}