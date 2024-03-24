import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LoginForm = styled.form`
  width: 350px;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3.5rem;
  color: #4D9FFF;
  font-family: "Playfair Display", Garamond, serif; /* List preferred fonts first */
  font-weight: bold; 
`;

const InputField = styled.input`
  color: #4D9FFF;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #4D9FFF;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
  background-color: rgba(77, 159, 255, 0.1); /* Add background color with 10% opacity */

  &:focus {
    border-color: #3498db;
  }
  &::placeholder {
    color: #4D9FFF
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #258cd1;
  }
`;

const RegisterLink = styled.p`
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  color: #555;

  a {
    color: #3498db;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
  }
`;

function App() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();

    const response = await fetch('http://216.250.11.247:8080/api/admin/login', {
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
  }

  return (
    <LoginContainer>
      <LoginForm onSubmit={loginUser}>
        <Title>Yukle</Title>
        <InputField
          value={username}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Username"
        />
        <InputField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <RegisterLink>
          <Link to="/forgot-password">Forgot password? </Link>
        </RegisterLink>
        <SubmitButton type="submit">Login</SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
}

export default App;
