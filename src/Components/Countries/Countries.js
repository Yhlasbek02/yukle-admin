import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, Typography } from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddCountryModal from '../addModalForm/Modal';
import EditCountryModal from '../addModalForm/editCountryModal';
import { useGlobalContext } from '../../context/globalContext';

export default function Countries() {
  const { countries, getCountries, deleteCountry } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isAddCountryModalOpen, setAddCountryModalOpen] = useState(false);
  const [isEditCountryModal, setEditCountryModal] = useState(false);
  const [englishEdit, setEnglishEdit] = useState('');
  const [russianEdit, setRussianEdit] = useState('');
  const [turkishEdit, setTurkishEdit] = useState('');
  const [turkmenEdit, setTurkmenEdit] = useState('');
  const [countryIdEdit, setCountryIdEdit] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedTotalPages = await getCountries(currentPage, searchKey);
        if (searchKey && currentPage > updatedTotalPages) {
          setCurrentPage(updatedTotalPages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentPage, searchKey]);

  const openAddCountryModal = () => setAddCountryModalOpen(true);
  const closeAddCountryModal = async () => {
    setAddCountryModalOpen(false);
    await getCountries(currentPage, searchKey);
  };

  const openEditCountry = (id, english, russian, turkish, turkmen) => {
    setCountryIdEdit(id);
    setEnglishEdit(english);
    setRussianEdit(russian);
    setTurkishEdit(turkish);
    setTurkmenEdit(turkmen);
    setEditCountryModal(true);
  };

  const closeEditCountryModal = async () => {
    setEditCountryModal(false);
    await getCountries(currentPage, searchKey);
  };

  const handleDeleteClick = (id) => setSelectedCountry(id);
  const handleConfirmDelete = async () => {
    try {
      await deleteCountry(selectedCountry);
      setSelectedCountry(null);
      await getCountries(currentPage, searchKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchKey}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: <Search />,
          }}
          sx={{ flex: 1, marginRight: 2 }}
        />
        <Button variant="contained" onClick={openAddCountryModal}>
          Add Country
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{background: "blue"}}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>English</TableCell>
              <TableCell sx={{ color: "#fff" }}>Russian</TableCell>
              <TableCell sx={{ color: "#fff" }}>Turkish</TableCell>
              <TableCell sx={{ color: "#fff" }}>Turkmen</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.countries.map((country, index) => (
              <TableRow key={country.uuid}>
                <TableCell>{(currentPage - 1) * 6 + index + 1}</TableCell>
                <TableCell>{country.nameEn || 'Not given'}</TableCell>
                <TableCell>{country.nameRu || 'Not given'}</TableCell>
                <TableCell>{country.nameTr || 'Not given'}</TableCell>
                <TableCell>{country.nameTm || 'Not given'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => openEditCountry(country.uuid, country.nameEn, country.nameRu, country.nameTr, country.nameTm)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(country.uuid)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={countries.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <ConfirmationModal
        isOpen={Boolean(selectedCountry)}
        onClose={() => setSelectedCountry(null)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this country?"
      />
      <AddCountryModal
        isopen={isAddCountryModalOpen.toString()}
        onClose={closeAddCountryModal}
      />
      <EditCountryModal
        isopen={isEditCountryModal.toString()}
        onClose={closeEditCountryModal}
        countryId={countryIdEdit}
        englishData={englishEdit}
        russianData={russianEdit}
        turkishData={turkishEdit}
        turkmenData={turkmenEdit}
      />
    </Box>
  );
}
