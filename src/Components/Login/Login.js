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
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
  &:focus {
    border-color: #3498db;
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
  text-align: center;
  color: #555;

  a {
    color: #3498db;
    text-decoration: none;
  }
`;

function App() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();

    const response = await fetch('http://localhost:3001/api/admin/login', {
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
        <Title>Login</Title>
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
        <SubmitButton type="submit">Login</SubmitButton>
        <RegisterLink>
          Not registered? <Link to="/register">Register Here</Link>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
}

export default App;
