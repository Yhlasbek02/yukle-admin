import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { Modal, TextField, Button, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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
`;

const ModalBody = styled.div`
  .MuiTextField-root {
    width: 100%;
    margin-bottom: 15px;
  }
`;

const ModalFooter = styled.div`
  text-align: right;
`;

const EditCargoTypeModal = ({ isopen, onClose, typeId, englishData, russianData, turkishData, turkmenData }) => {
  const { editCargoTypes } = useGlobalContext();
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [turkmen, setTurkmen] = useState('');

  useEffect(() => {
    setEnglish(englishData);
    setRussian(russianData);
    setTurkish(turkishData);
    setTurkmen(turkmenData);
  }, [englishData, russianData, turkishData, turkmenData]);

  const handleSave = async () => {
    try {
      await editCargoTypes(typeId, english, russian, turkish, turkmen);
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
    <ModalOverlay isopen={isopen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Typography variant="h6">Edit Cargo Type</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        <ModalBody>
          <TextField
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Russian"
            value={russian}
            onChange={(e) => setRussian(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Turkish"
            value={turkish}
            onChange={(e) => setTurkish(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Turkmen"
            value={turkmen}
            onChange={(e) => setTurkmen(e.target.value)}
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

export default EditCargoTypeModal;
