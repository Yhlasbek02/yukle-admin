import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RegisterForm = styled.form`
  width: 350px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LoginLink = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
`;

function App() {
	const navigate = useNavigate();

	const [username, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password_confirmation, setPasswordConfirmation] = useState('');

	async function registerUser(event) {
		event.preventDefault();

		const response = await fetch('http://localhost:5000/api/v1/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				email,
				password,
				password_confirmation,
			}),
		});

		const data = await response.json();

		if (data.status !== 'false' && data.token) {
			localStorage.setItem('token', `${data.token}`);
			navigate('/');
		} else {
			alert(data.message);
		}
	}

	return (
		<RegisterContainer>
			<RegisterForm onSubmit={registerUser}>
				<Title>Register</Title>
				<InputField
					value={username}
					onChange={(e) => setName(e.target.value)}
					type="text"
					placeholder="Username"
				/>
				<InputField
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
				/>
				<InputField
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
				<InputField
					value={password_confirmation}
					onChange={(e) => setPasswordConfirmation(e.target.value)}
					type="password"
					placeholder="Password again"
				/>
				<SubmitButton type="submit">Register</SubmitButton>
				<LoginLink>
					Already have an account? <Link to="/login">Login here</Link>
				</LoginLink>
			</RegisterForm>
		</RegisterContainer>
	);
}

export default App;
