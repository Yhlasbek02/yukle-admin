import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    IconButton,
    Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useGlobalContext } from '../../context/globalContext';
import ConfirmationModal from '../ConfirmationModal/Modal';

export default function Users() {
    const { users, getUsers, deleteUser, changePaid } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDelete, setSelectedDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsers(currentPage);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 6 + 1);
    };

    const handleDeleteClick = (id) => setSelectedDelete(id);
    const handlePaidClick = (id) => setSelectedUser(id);

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedDelete);
            setSelectedDelete(null);

            // Handle pagination adjustments
            if (users.users.length === 0 && currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                setStartIndex((newPage - 1) * 8 + 1);
                await getUsers(newPage);
            } else {
                await getUsers(currentPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmPaid = async () => {
        try {
            await changePaid(selectedUser);
            setSelectedUser(null);
            await getUsers(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    if (!users) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: '1rem' }}>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{background: 'blue'}}>
                            <TableCell sx={{color: "#fff"}}>ID</TableCell>
                            <TableCell sx={{color: "#fff"}}>Name</TableCell>
                            <TableCell sx={{color: "#fff"}}>Surname</TableCell>
                            <TableCell sx={{color: "#fff"}}>Email</TableCell>
                            <TableCell sx={{color: "#fff"}}>Mobile Number</TableCell>
                            <TableCell sx={{color: "#fff"}}>Paid</TableCell>
                            <TableCell sx={{color: "#fff"}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.users.map((user, index) => {
                            const userId = startIndex + index;
                            return (
                                <TableRow key={userId}>
                                    <TableCell>{userId}</TableCell>
                                    <TableCell>{user.name || 'Not given'}</TableCell>
                                    <TableCell>{user.surname || 'Not given'}</TableCell>
                                    <TableCell>{user.email || 'Not given'}</TableCell>
                                    <TableCell>{user.phoneNumber || 'Not given'}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color: user.paid ? 'blue' : 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {user.paid ? 'true' : 'false'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(user.uuid)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handlePaidClick(user.uuid)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1rem',
                }}
            >
                <Pagination
                    count={users.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
            {/* Modals */}
            <ConfirmationModal
                isOpen={Boolean(selectedDelete)}
                onClose={() => setSelectedDelete(null)}
                onConfirm={handleConfirmDelete}
                message="Are you sure to delete this user?"
            />
            <ConfirmationModal
                isOpen={Boolean(selectedUser)}
                onClose={() => setSelectedUser(null)}
                onConfirm={handleConfirmPaid}
                message="Are you sure to change the paid status?"
            />
        </Box>
    );
}
