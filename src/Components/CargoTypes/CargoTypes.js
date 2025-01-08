import React, { useEffect, useState } from 'react';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import { Delete, Edit, ChevronLeft, ChevronRight } from '@mui/icons-material'; // Import MUI icons
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from '@mui/material';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddCargoTypeModal from '../addModalForm/addCargoType';
import EditCargoTypeModal from '../addModalForm/editCargoTypeModal';

export default function CargoTypes() {
  const { cargoTypes, getCargoTypes, deleteCargoType } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [turkmen, setTurkmen] = useState('');
  const [selectedCargoType, setSelectedCargoType] = useState(null);
  const [isAddCargoTypeModalOpen, setAddCargoTypeModalOpen] = useState(false);
  const [idEdit, setIdEdit] = useState('');
  const [isEditTypeModal, setEditTypeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCargoTypes(currentPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);

  const page = cargoTypes.currentPage;
  const total = cargoTypes.totalPages;

  const openAddCargoTypeModal = () => {
    setAddCargoTypeModalOpen(true);
  };

  const closeAddCargoTypeModal = async () => {
    setAddCargoTypeModalOpen(false);
    await getCargoTypes(currentPage);
  };

  const closeEditCargoTypeModal = async () => {
    setEditTypeModal(false);
    await getCargoTypes(currentPage);
  };

  const handleDeleteClick = (id) => {
    setSelectedCargoType(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCargoType(selectedCargoType);
      setSelectedCargoType(null);
      await getCargoTypes(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditCountry = (typeId, english, russian, turkish, turkmen) => {
    setIdEdit(typeId);
    setEnglish(english);
    setRussian(russian);
    setTurkish(turkish);
    setTurkmen(turkmen)
    setEditTypeModal(true);
  };

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage); // Use the page number directly
    setStartIndex((newPage - 1) * 6 + 1); // Adjust the start index for pagination
    try {
      await getCargoTypes(newPage);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div style={{ padding: '1rem' }}>



      <Button
        variant="contained"
        color="primary"
        onClick={openAddCargoTypeModal}
        sx={{ mb: 2 }}
      >
        Add Cargo Type
      </Button>
      <TableContainer sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "blue" }}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>English</TableCell>
              <TableCell sx={{ color: "#fff" }}>Russian</TableCell>
              <TableCell sx={{ color: "#fff" }}>Turkish</TableCell>
              <TableCell sx={{ color: "#fff" }}>Turkmen</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargoTypes.cargoTypes.map((cargoType, index) => {
              const cargoTypeId = index + startIndex;
              return (
                <TableRow key={cargoTypeId}>
                  <TableCell>{cargoTypeId}</TableCell>
                  <TableCell>{cargoType.nameEn || 'Not given'}</TableCell>
                  <TableCell>{cargoType.nameRu || 'Not given'}</TableCell>
                  <TableCell>{cargoType.nameTr || 'Not given'}</TableCell>
                  <TableCell>{cargoType.nameTm || 'Not given'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openEditCountry(cargoType.uuid, cargoType.nameEn, cargoType.nameRu, cargoType.nameTr, cargoType.nameTm)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(cargoType.uuid)}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={total}
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      />

      <ConfirmationModal
        isOpen={selectedCargoType !== null ? 'true' : undefined}
        onClose={() => setSelectedCargoType(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
      />
      <AddCargoTypeModal
        isopen={isAddCargoTypeModalOpen.toString()}
        onClose={closeAddCargoTypeModal}
      />
      <EditCargoTypeModal
        isopen={isEditTypeModal.toString()}
        onClose={closeEditCargoTypeModal}
        typeId={idEdit}
        englishData={english}
        russianData={russian}
        turkishData={turkish}
        turkmenData={turkmen}
      />
    </div>
  );
}
