import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useGlobalContext } from '../../context/globalContext';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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


const EditTruckBodyModal = ({ isopen, onClose, id, englishData, russianData, turkishData, turkmenData, transportTypeId }) => {
    const { editTruckBody } = useGlobalContext();
    const [uuid, setId] = useState('')
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [turkmen, setTurkmen] = useState('');
    const [transportType, setTransportType] = useState('');
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
        setId(id)
        setEnglish(englishData);
        setRussian(russianData);
        setTurkish(turkishData);
        setTurkmen(turkmenData);
        setTransportType(transportTypeId)
    }, [id, englishData, russianData, turkishData, turkmenData, transportTypeId]);

    useEffect(() => {
        fetchTransportTypes();
    }, [])

    const handleSave = async () => {
        try {
            await editTruckBody(uuid, english, russian, turkish, turkmen, selectedTransportType.id);
            setEnglish('');
            setRussian('');
            setTurkish('');
            setTurkmen('');
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

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

    return (
        <ModalOverlay isopen={isopen.toString()} onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h2>Edit Truck Body</h2>
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


export default EditTruckBodyModal;
