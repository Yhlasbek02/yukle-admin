import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

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
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  text-align: right;
`;

const AddTruckBodyModal = ({ isopen, onClose }) => {
    const { addTruckBody } = useGlobalContext();
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [turkmen, setTurkmen] = useState('');
    const [selectedTransportType, setSelectedTrnasportType] = useState('');
    const [transportTypes, setTransportTypes] = useState([]);
    const selectTransportType = (event) => {
        const selectedCountryId = event.target.value;
        const selectedCountryObj = transportTypes.find(
            (country) => country.id === selectedCountryId
        );
        setSelectedTrnasportType(selectedCountryObj);
    };


    useEffect(() => {
        fetchTransportTypes()
    }, []);

    const BASE_URL = "http://216.250.9.3:3001/api/admin/";

    const fetchTransportTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}transport-type?page=1&pageSize=100`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            setTransportTypes(response.data.transportTypes);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSave = async () => {
        try {
            if (!english || !russian || !turkish || !turkmen || !selectedTransportType) {
                alert('Please fill all fields.');
                return;
            }
            await addTruckBody(english, russian, turkish, turkmen, selectedTransportType.id);
            setEnglish('');
            setRussian('');
            setTurkish('');
            onClose();
        } catch (error) {
            console.error('Failed to add truck body:', error);
        }
    };


    return (
        <ModalOverlay isopen={isopen.toString()} onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2 style={{ marginRight: '1.2rem' }}>Add Truck Body</h2>
                    <Button onClick={onClose}>X</Button>
                </ModalHeader>
                <ModalBody>
                    <TextField
                        label="English"
                        fullWidth
                        value={english}
                        onChange={(e) => setEnglish(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Russian"
                        fullWidth
                        value={russian}
                        onChange={(e) => setRussian(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Turkish"
                        fullWidth
                        value={turkish}
                        onChange={(e) => setTurkish(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Turkmen"
                        fullWidth
                        value={turkmen}
                        onChange={(e) => setTurkmen(e.target.value)}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Transport Type</InputLabel>
                        <Select
                            value={selectedTransportType?.id || ''}
                            onChange={selectTransportType}
                            label="Country"
                        >
                            <MenuItem value="">
                                <em>-- Select Transport Type --</em>
                            </MenuItem>
                            {transportTypes.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.nameEn}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

export default AddTruckBodyModal;
