import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Box, Typography, Pagination, PaginationItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useGlobalContext } from '../../context/globalContext';
import moment from 'moment';

export default function Transports() {
  const { transports, getTransports, deleteTransport } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTransports(currentPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [currentPage]);

  const page = transports.currentPage;
  const total = transports.totalPages;

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 6 + 1);
    try {
      await getTransports(newPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedTransport(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTransport(selectedTransport);
      setSelectedTransport(null);
      await getTransports(currentPage);

      if (transports.transports.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 6 + 1);
        await getTransports(newPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>Transports</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "blue" }}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Type</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Mobile Number</TableCell>
              <TableCell sx={{ color: "#fff" }}>Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Location</TableCell>
              <TableCell sx={{ color: "#fff" }}>BelongsTo</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transports.transports.map((transport, index) => {
              const transportId = index + startIndex;
              const typeName = transport.type?.nameEn || 'Not given';
              const locationName = transport.location_country?.nameEn || 'Not given';
              const locationCity = transport.location_city?.nameEn || 'Not given';
              const truncatedCity = locationCity.length > 10 ? `${locationCity.substring(0, 10)}...` : locationCity;
              const belongsToName = transport.affiliation_country?.nameEn || 'Not given';
              const date = moment(transport.createdAt).format('YYYY-MM-DD');

              return (
                <TableRow key={transport.uuid}>
                  <TableCell>{transportId}</TableCell>
                  <TableCell>{transport.name || 'Not given'}</TableCell>
                  <TableCell>{typeName}</TableCell>
                  <TableCell>{transport.email || 'Not given'}</TableCell>
                  <TableCell>{transport.phoneNumber || 'Not given'}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>{`${locationName}, ${truncatedCity}`}</TableCell>
                  <TableCell>{belongsToName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteClick(transport.uuid)}
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


      <Dialog
        open={selectedTransport !== null}
        onClose={() => setSelectedTransport(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this transport?</DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTransport(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
