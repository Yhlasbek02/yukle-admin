import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context/globalContext';
import { Delete, Edit } from '@mui/icons-material';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Pagination } from '@mui/material';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddTruckBodyModal from '../addModalForm/addTruckBodyModal';
import EditTruckBodyModal from '../addModalForm/editTruckBody';


export default function TruckBodies() {
    const { getTruckBodies, deleteTruckBody } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [turkmen, setTurkmen] = useState('');
    const [isAddTypeModalOpen, setAddTypeModalOpen] = useState(false);
    const [idEdit, setIdEdit] = useState('');
    const [startIndex, setStartIndex] = useState(1);
    const [isEditTypeModal, setEditTypeModal] = useState(false);
    const [types, getTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [transportTypeId, setTransportTypeId] = useState('')
    const [total, setTotal] = useState('');

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            const response = await getTruckBodies(currentPage, 6);
            getTypes(response.types);
            setTotal(response.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const closeAddTypeModal = async () => {
        setAddTypeModalOpen(false);
        fetchData()
    };

    const openAddTypeModal = () => {
        setAddTypeModalOpen(true);
    };

    const handlePageChange = async (event, newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 6 + 1);
        try {
            await getTruckBodies(newPage, 6);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedType(id);
    };

    const closeEditTypeModal = async () => {
        setEditTypeModal(false);
        fetchData();
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteTruckBody(selectedType);
            setSelectedType(null);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const openEditCountry = (id, english, russian, turkish, turkmen, transportTypeId) => {
        setIdEdit(id);
        setEnglish(english);
        setRussian(russian);
        setTurkish(turkish);
        setTurkmen(turkmen);
        setTransportTypeId(transportTypeId)
        setEditTypeModal(true);
    };


    return (
        <div style={{ padding: '1rem' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={openAddTypeModal}
                sx={{ mb: 2 }}
            >
                Add truck body
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
                            <TableCell sx={{ color: "#fff" }}>Transport Type</TableCell>
                            <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map((type, index) => {
                            const cargoTypeId = index + startIndex;
                            return (
                                <TableRow key={cargoTypeId}>
                                    <TableCell>{cargoTypeId}</TableCell>
                                    <TableCell>{type.nameEn || 'Not given'}</TableCell>
                                    <TableCell>{type.nameRu || 'Not given'}</TableCell>
                                    <TableCell>{type.nameTr || 'Not given'}</TableCell>
                                    <TableCell>{type.nameTm || 'Not given'}</TableCell>
                                    <TableCell>{type.transportType.nameEn || 'Not given'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => openEditCountry(type.uuid, type.nameEn, type.nameRu, type.nameTr, type.nameTm, type.transportType.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteClick(type.uuid)}
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

            <AddTruckBodyModal isopen={isAddTypeModalOpen.toString()} onClose={closeAddTypeModal} />
            <ConfirmationModal isOpen={selectedType !== null ? 'true' : undefined} onClose={() => setSelectedType(null)} onConfirm={handleConfirmDelete} message={'Are you sure to delete?'} />
            <EditTruckBodyModal
                isopen={isEditTypeModal.toString()}
                onClose={closeEditTypeModal}
                id={idEdit}
                englishData={english}
                russianData={russian}
                turkishData={turkish}
                turkmenData={turkmen}
                transportTypeId={transportTypeId}
            />
        </div>
    )
}
