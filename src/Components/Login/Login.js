import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  styled,
} from '@mui/material';

const LoginContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const LoginForm = styled(Box)({
  width: '350px',
  padding: '20px',
});

const StyledLink = styled(Link)({
  color: '#3498db',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 'bold',
});

function Login() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://216.250.9.3:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <LoginContainer>
      <LoginForm component="form" onSubmit={loginUser}>
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: '3.5rem',
            color: '#4D9FFF',
            fontFamily: 'Playfair Display, Garamond, serif',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          Yukle
        </Typography>
        <TextField
          value={username}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          label="Username"
          placeholder="Username"
          InputProps={{
            style: {
              color: '#4D9FFF',
              backgroundColor: 'rgba(77, 159, 255, 0.1)',
            },
          }}
          InputLabelProps={{
            style: { color: '#4D9FFF' },
          }}
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          label="Password"
          placeholder="Password"
          InputProps={{
            style: {
              color: '#4D9FFF',
              backgroundColor: 'rgba(77, 159, 255, 0.1)',
            },
          }}
          InputLabelProps={{
            style: { color: '#4D9FFF' },
          }}
        />
        <Box textAlign="center" mt={1} mb={2}>
          <StyledLink to="/forgot-password">Forgot password?</StyledLink>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading} // Disable button when loading
          sx={{
            backgroundColor: '#3498db',
            color: '#fff',
            fontSize: '18px',
            padding: '12px',
            '&:hover': { backgroundColor: '#258cd1' },
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{ color: '#fff' }}
            />
          ) : (
            'Login'
          )}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
