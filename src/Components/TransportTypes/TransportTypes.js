import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { Delete, Edit} from '@mui/icons-material';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddTypeModal from '../addModalForm/addTransportType';
import EditTransportTypeModal from '../addModalForm/editTransportType';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Paper } from '@mui/material';

export default function TransportTypes() {
  const { transportTypes, getTransportTypes, addTransportType, deleteTransportType, editTransportTypes } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [turkmen, setTurkmen] = useState('');
  const [idEdit, setIdEdit] = useState('');
  const [selectedTransportType, setSelectedTransportType] = useState(null);
  const [isAddTypeModal, setAddTypeModal] = useState(false);
  const [isEditTypeModal, setEditTypeModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTransportTypes(currentPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentPage]);

  const page = transportTypes.currentPage;
  const total = transportTypes.totalPages;

  const openAddTypeModal = () => {
    setAddTypeModal(true);
  };

  const closeAddTypeModal = async () => {
    setAddTypeModal(false);
    await getTransportTypes(currentPage);
  };

  const closeEditTypeModal = async () => {
    setEditTypeModal(false);
    await getTransportTypes(currentPage);
  };

  const openEditType = (typeId, english, russian, turkish, turkmen) => {
    setIdEdit(typeId);
    setEnglish(english);
    setRussian(russian);
    setTurkish(turkish);
    setTurkmen(turkmen);
    setEditTypeModal(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedTransportType(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTransportType(selectedTransportType);
      setSelectedTransportType(null);
      await getTransportTypes(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 6 + 1);
    try {
      await getTransportTypes(newPage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={openAddTypeModal}
        style={{ marginBottom: '10px' }}
      >
        Add Transport Type
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table>
          <TableHead>
            <TableRow sx={{background: "blue"}}>
              <TableCell sx={{color: "#fff"}}>ID</TableCell>
              <TableCell sx={{color: "#fff"}}>English</TableCell>
              <TableCell sx={{color: "#fff"}}>Russian</TableCell>
              <TableCell sx={{color: "#fff"}}>Turkish</TableCell>
              <TableCell sx={{color: "#fff"}}>Turkmen</TableCell>
              <TableCell sx={{color: "#fff"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transportTypes.transportTypes.map((transportType, index) => {
              const transportTypeId = index + startIndex;
              return (
                <TableRow key={transportTypeId}>
                  <TableCell>{transportTypeId}</TableCell>
                  <TableCell>{transportType.nameEn || 'Not given'}</TableCell>
                  <TableCell>{transportType.nameRu || 'Not given'}</TableCell>
                  <TableCell>{transportType.nameTr || 'Not given'}</TableCell>
                  <TableCell>{transportType.nameTm || 'Not given'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openEditType(transportType.uuid, transportType.nameEn, transportType.nameRu, transportType.nameTr, transportType.nameTm)}
                      style={{ marginRight: '10px' }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(transportType.uuid)}
                      style={{ marginRight: '10px' }}
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
        isOpen={selectedTransportType !== null ? 'true' : undefined}
        onClose={() => setSelectedTransportType(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
      />
      <AddTypeModal isopen={isAddTypeModal.toString()} onClose={closeAddTypeModal} />
      <EditTransportTypeModal
        isopen={isEditTypeModal.toString()}
        onClose={closeEditTypeModal}
        typeId={idEdit}
        englishData={english}
        russianData={russian}
        turkishData={turkish}
        turkmenData={turkmen}
      />
    </div>
  );
}
