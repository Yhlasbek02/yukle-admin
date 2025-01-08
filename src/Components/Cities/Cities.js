import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Select, MenuItem, Typography, Pagination, PaginationItem } from '@mui/material';
import { useGlobalContext } from '../../context/globalContext';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddCityModal from '../addModalForm/addModal';
import EditCityModal from '../addModalForm/editCityModal';
import _debounce from 'lodash.debounce';
import axios from 'axios';

export default function Cities() {
    const {
        cities,
        getCities,
        allCountries,
        getAllCountries,
        addCity,
        deleteCity,
        editCity,
    } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [editingCity, setEditingCity] = useState(null);
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [countryId, setCountryId] = useState('');
    const [id, setId] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [englishEdit, setEnglishEdit] = useState('');
    const [russianEdit, setRussianEdit] = useState('');
    const [turkishEdit, setTurkishEdit] = useState('');
    const [turkmenEdit, setTurkmenEdit] = useState('');
    const [countryIdEdit, setCountryIdEdit] = useState('');
    const [isAddCityModalOpen, setAddCityModalOpen] = useState(false);
    const [isEditCityModal, setEditCityModal] = useState(false);

    const debouncedFetchData = _debounce(fetchData, 300);
    let cancelFetch;

    useEffect(() => {
        debouncedFetchData();
    }, [currentPage, selectedCountry, searchKey]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAllCountries();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    async function fetchData() {
        try {
            if (cancelFetch) {
                cancelFetch();
            }

            const source = axios.CancelToken.source();
            cancelFetch = source.cancel;

            let updatedTotalPages;
            if (selectedCountry) {
                updatedTotalPages = await getCities(
                    selectedCountry.uuid,
                    currentPage,
                    searchKey,
                    { cancelToken: source.token }
                );
            } else {
                updatedTotalPages = await getCities('', currentPage, searchKey, {
                    cancelToken: source.token,
                });
            }

            if (searchKey && currentPage > updatedTotalPages) {
                setCurrentPage(updatedTotalPages);
                const newStartIndex = Math.max((updatedTotalPages - 1) * 8 + 1, 1);
                setStartIndex(newStartIndex);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                // Handle cancelation
            } else {
                console.error(error);
            }
        }
    }

    const openAddCityModal = () => setAddCityModalOpen(true);

    const openEditCity = (id, english, russian, turkish, turkmen, countryId) => {
        setId(id);
        setEnglishEdit(english);
        setRussianEdit(russian);
        setTurkishEdit(turkish);
        setTurkmenEdit(turkmen)
        setCountryIdEdit(countryId);
        setEditCityModal(true);
    };

    const closeEditModal = async () => {
        setEditCityModal(false);
        if (selectedCountry) {
            await getCities(selectedCountry.uuid, currentPage, searchKey);
        } else {
            await getCities('', currentPage, searchKey);
        }
    };

    const closeAddCityModal = () => {
        setAddCityModalOpen(false);
    };

    const handleCountryChange = (event) => {
        const selectedCountryId = event.target.value;
        const selectedCountryObj = allCountries.countries.find(
            (country) => country.uuid === selectedCountryId
        );
        setSelectedCountry(selectedCountryObj);
        setCurrentPage(1);
    };

    const handleSave = async () => {
        try {
            if (editingCity) {
                await editCity(editingCity, english, russian, turkish, countryId);
            } else {
                await addCity(english, russian, turkish, countryId);
            }
            setEnglish('');
            setRussian('');
            setTurkish('');
            setCountryId(null);
            setEditingCity(null);
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, currentPage);
            } else {
                await getCities('', currentPage);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = async (event, newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 6 + 1);
        try {
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, newPage, searchKey);
            } else {
                await getCities('', newPage, searchKey);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };

    const handleDeleteClick = (id) => {
        setSelectedCity(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCity(selectedCity);
            setSelectedCity(null);
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, currentPage);
            } else {
                await getCities('', currentPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Select
                    value={selectedCountry?.uuid || ''}
                    onChange={handleCountryChange}
                    displayEmpty
                    sx={{ minWidth: '200px' }}
                >
                    <MenuItem value="">-- Select Country --</MenuItem>
                    {allCountries.countries.map((country) => (
                        <MenuItem key={country.uuid} value={country.uuid}>
                            {country.nameEn}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    placeholder="Search..."
                    value={searchKey}
                    onChange={handleSearchChange}
                    sx={{ minWidth: '300px' }}
                />
                <Button variant="contained" color="primary" onClick={openAddCityModal}>
                    Add City
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow sx={{background: 'blue'}}>
                        <TableCell sx={{ color: "#fff" }}>ID</TableCell>
                        <TableCell sx={{ color: "#fff" }}>English</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Russian</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Turkish</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Turkmen</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cities.cities
                        .filter(
                            (city) =>
                                city.nameEn.toLowerCase().includes(searchKey.toLowerCase()) ||
                                city.nameRu.toLowerCase().includes(searchKey.toLowerCase()) ||
                                city.nameTr.toLowerCase().includes(searchKey.toLowerCase())
                        )
                        .map((city, index) => (
                            <TableRow key={city.uuid}>
                                <TableCell>{index + startIndex}</TableCell>
                                <TableCell>{city.nameEn || 'Not given'}</TableCell>
                                <TableCell>{city.nameRu || 'Not given'}</TableCell>
                                <TableCell>{city.nameTr || 'Not given'}</TableCell>
                                <TableCell>{city.nameTm || 'Not given'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() =>
                                            openEditCity(
                                                city.uuid,
                                                city.nameEn,
                                                city.nameRu,
                                                city.nameTr,
                                                city.nameTm,
                                                city.country.id
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteClick(city.uuid)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Pagination
                    count={cities.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <ConfirmationModal
                isOpen={Boolean(selectedCity)}
                onClose={() => setSelectedCity(null)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this city?"
            />
            <AddCityModal isopen={isAddCityModalOpen} onClose={closeAddCityModal} />
            <EditCityModal
                isopen={isEditCityModal}
                onClose={closeEditModal}
                cityId={id}
                englishData={englishEdit}
                russianData={russianEdit}
                turkishData={turkishEdit}
                turkmenData={turkmenEdit}
                countryId={countryIdEdit}
            />
        </Box>
    );
}
