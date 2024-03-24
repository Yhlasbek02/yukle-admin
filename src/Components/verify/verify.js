import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  width: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Horizontally center */
  justify-content: center;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: #4D9FFF;
  font-family: "Playfair Display", Garamond, serif; /* List preferred fonts first */
  font-weight: bold; 
  margin-bottom: 1.5rem;
`;

const CodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
`

const InputField = styled.input`
  width: 12%;
  height: 60px;
  margin: 10px 1%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #4D9FFF;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, background-color 0.3s;
  text-align: center;

  &:focus {
    border-color: #3498db;
    background-color: #f0f8ff;
     /* Light blue for focus */
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 30%;
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

const TryAgainMessage = styled(Link)`
  text-align: center;
  color: red;
  font-size: 16px;
  text-decoration: none; /* Remove underline */
  cursor: pointer; /* Add cursor pointer for better user experience */
`;

const Paragraph = styled.p`
  text-align: center;
  margin-top: 10px;
  color: #4D9FFF;
  font-size: 1rem;

`;

const Timer = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 1.5rem;
  color: #4D9FFF;
  font-weight: bold;
`;


export default function Verify() {
  const [otp, setOTP] = useState(['', '', '', '']);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const navigate = useNavigate();

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setShowTryAgain(true);
      setInputsDisabled(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleInputChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;

    if (value !== '') {
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    } else {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }

    setOTP(newOTP);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  async function sendMessage(event) {
    event.preventDefault();
    const enteredOTP = otp.join('');
    const response = await fetch('http://216.250.11.247:8080/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: enteredOTP,
      }),
    });
    const data = await response.json();
    if (data.status) {
      localStorage.setItem('token', data.token);
      navigate('/change-password');
    } else {
      alert(data.message);
    }
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Container>
      <Form onSubmit={sendMessage}>
        <Title>Verification</Title>
        <Timer>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Timer>
        <Paragraph>Type the verification code <br></br> we've sent you</Paragraph>
        <CodeContainer>
          {otp.map((digit, index) => (
            <InputField
              key={index}
              ref={inputRefs[index]}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              type='text'
              maxLength={1}
              disabled={inputsDisabled}
            />
          ))}
        </CodeContainer>

        <SubmitButton type='submit' disabled={showTryAgain || inputsDisabled}>
          Next
        </SubmitButton>
        {showTryAgain && (
          <TryAgainMessage to="/forgot-password">
            Try again
          </TryAgainMessage>
        )}
      </Form>
    </Container>
  );
}