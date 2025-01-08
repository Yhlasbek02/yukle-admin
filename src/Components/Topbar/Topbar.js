import React, { useEffect, useRef } from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/globalContext';

export default function Topbar() {
  const { profile, getProfile, logout } = useGlobalContext();
  const navigate = useNavigate();
  const isCancelled = useRef(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      if (isCancelled.current) {
        isCancelled.current = false;
        getProfile();
      }
    }
  }, [getProfile, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const username = profile?.username || 'User';
  const email = profile?.email || 'user@example.com';

  return (
    <TopbarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <AccountCircleIcon sx={{ fontSize: 36, marginRight: 2, color: '#4D9FFF' }} />
        <Box>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', color: "#fff" }}>
            {username}
          </Typography>
          <Typography variant="body2" color="#fff">
            {email}
          </Typography>
        </Box>
      </Box>
      <IconButton
        color="#fff"
        onClick={handleLogout}
        sx={{
          backgroundColor: 'rgba(77, 159, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(77, 159, 255, 0.2)',
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    </TopbarContainer>
  );
}

const TopbarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(77, 159, 255, 1)',
  height: '3.5rem',
  width: '100%'
}));
