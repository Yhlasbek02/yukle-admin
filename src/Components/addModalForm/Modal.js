import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { TextField, Button } from '@mui/material';

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
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  text-align: right;
`;

const AddCountryModal = ({ isopen, onClose }) => {
  const { addCountry } = useGlobalContext();
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [turkmen, setTurkmen] = useState('');

  const handleSave = async () => {
    await addCountry(english, russian, turkish, turkmen);
    setEnglish('');
    setRussian('');
    setTurkish('');
    onClose();
  };

  return (
    <ModalOverlay isopen={isopen.toString()} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2 style={{ marginRight: '1.2rem' }}>Add Country</h2>
          <Button variant="outlined" color="error" onClick={onClose}>
            Close
          </Button>
        </ModalHeader>
        <ModalBody>
          <TextField
            fullWidth
            label="English"
            variant="outlined"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Russian"
            variant="outlined"
            value={russian}
            onChange={(e) => setRussian(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Turkish"
            variant="outlined"
            value={turkish}
            onChange={(e) => setTurkish(e.target.value)}
            margin="normal"
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddCountryModal;
