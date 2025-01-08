import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { Button, TextField, Select, MenuItem } from '@mui/material';
const ModalOverlay = styled.div.attrs((props) => ({
  style: {
    display: props.isopen === 'true' ? 'block' : 'none',
  },
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  z-index: 2;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    margin: 0;
  }

  button {
    padding: 8px;
    cursor: pointer;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 15px;
`;

const ModalFooter = styled.div`
  text-align: right;
`;


const EditCityModal = ({ isopen, onClose, cityId, englishData, russianData, turkishData, turkmenData, countryId }) => {
  const { editCity } = useGlobalContext();

  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [turkmen, setTurkmen] = useState('');
  useEffect(() => {
    setEnglish(englishData);
    setRussian(russianData);
    setTurkish(turkishData);
    setTurkmen(turkmenData)
  }, [englishData, russianData, turkishData, turkmenData]);

  const handleSave = async () => {
    try {
      await editCity(cityId, english, russian, turkish, turkmen, countryId);
      setEnglish('');
      setRussian('');
      setTurkish('');
      setTurkmen('');
      onClose();
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <ModalOverlay isopen={isopen.toString()} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Edit City</h2>
          <Button variant="contained" color="error" onClick={onClose}>
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <TextField
            fullWidth
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Russian"
            value={russian}
            onChange={(e) => setRussian(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Turkish"
            value={turkish}
            onChange={(e) => setTurkish(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Turkmen"
            value={turkmen}
            onChange={(e) => setTurkmen(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};


export default EditCityModal;
