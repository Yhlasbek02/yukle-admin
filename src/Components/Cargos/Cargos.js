import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, Modal } from '@mui/material';
import { Delete } from '@mui/icons-material';
import moment from 'moment';
import { useGlobalContext } from '../../context/globalContext';

export default function Cargos() {
  const { cargos, getCargos, deleteCargo } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCargo, setSelectedCargo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCargos(currentPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentPage]);

  const page = cargos.currentPage || 1;
  const total = cargos.totalPages || 1;

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
    try {
      await getCargos(newPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedCargo(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCargo(selectedCargo);
      setSelectedCargo(null);
      await getCargos(currentPage);
      if (cargos.cargos.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        await getCargos(newPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ mb: 2}}>
        Cargos List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{background: "blue"}}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Type</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mobile Number</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>From</TableCell>
              <TableCell sx={{ color: "#fff" }}>To</TableCell>
              <TableCell sx={{ color: "#fff" }}>Weight</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargos.cargos.map((cargo, index) => {
              const cargoId = (currentPage - 1) * 6 + index + 1;
              const typeName = cargo?.type?.nameEn || 'Not given';
              const fromCountryName = cargo?.from_country?.nameEn || 'Not given';
              const toCountryName = cargo?.to_country?.nameEn || 'Not given';
              const fromCityName = cargo?.from_city?.nameEn.length > 10 ? `${cargo.from_city.nameEn.substring(0,10)}...` : cargo?.from_city?.nameEn || 'Not given';
              const toCityName = cargo?.to_city?.nameEn.length > 10 ? `${cargo.to_city.nameEn.substring(0,10)}...` : cargo?.to_city?.nameEn || 'Not given';
              const date = cargo?.createdAt ? moment(cargo.createdAt).format("YYYY-MM-DD") : 'Not given';

              return (
                <TableRow key={cargo.uuid}>
                  <TableCell>{cargoId}</TableCell>
                  <TableCell>{cargo?.name || 'Not given'}</TableCell>
                  <TableCell>{typeName}</TableCell>
                  <TableCell>{cargo?.email || 'Not given'}</TableCell>
                  <TableCell>{cargo?.phoneNumber || 'Not given'}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{`${fromCountryName}, ${fromCityName}`}</TableCell>
                  <TableCell>{`${toCountryName}, ${toCityName}`}</TableCell>
                  <TableCell>{cargo?.weight || 'Not given'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(cargo.uuid)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={total}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Modal
        open={Boolean(selectedCargo)}
        onClose={() => setSelectedCargo(null)}
        aria-labelledby="confirmation-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete this cargo?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => setSelectedCargo(null)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              color="error"
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
