import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { Delete, Edit} from '@mui/icons-material';
import { Button, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddTypeModal from '../addModalForm/addDangerousType';
import EditDangerousTypeModal from '../addModalForm/editDangerousType';

export default function DangerousTypes() {
    const { getDangerousType, deleteDangerousType } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [turkmen, setTurkmen] = useState('');
    const [isAddTypeModalOpen, setAddTypeModalOpen] = useState(false);
    const [idEdit, setIdEdit] = useState('');
    const [isEditTypeModal, setEditTypeModal] = useState(false);
    const [types, getTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [page, setPage] = useState('');
    const [total, setTotal] = useState('');

    useEffect(() => {
        fetchData();
    }, [currentPage]);


    const fetchData = async () => {
        try {
            const response = await getDangerousType(currentPage, 6);
            getTypes(response.types);
            setPage(response.currentPage);
            setTotal(response.totalPages)
        } catch (error) {
            console.error(error);
        }
    };

    const openAddTypeModal = () => {
        setAddTypeModalOpen(true);
    };

    const closeAddTypeModal = async () => {
        setAddTypeModalOpen(false);
        fetchData()
    };

    const closeEditTypeModal = async () => {
        setEditTypeModal(false);
        fetchData();
    };

    const handleDeleteClick = (id) => {
        setSelectedType(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteDangerousType(selectedType);
            setSelectedType(null);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const openEditCountry = (id, english, russian, turkish, turkmen) => {
        setIdEdit(id);
        setEnglish(english);
        setRussian(russian);
        setTurkish(turkish);
        setTurkmen(turkmen)
        setEditTypeModal(true);
    };

    const handlePageChange = async (event, newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 6 + 1);
        try {
          await getDangerousType(newPage, 6);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div style={{ padding: '1rem', overflowY: 'auto' }}>
        <Button
            variant="contained"
            color="primary"
            onClick={openAddTypeModal}
            sx={{ mb: 2 }}
        >
            Add Dangerous Type
        </Button>
        <TableContainer sx={{ boxShadow: 3, height: 'auto' }}>
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
                {types.map((type, index) => {
                const cargoTypeId = index + startIndex;
                return (
                    <TableRow key={cargoTypeId}>
                    <TableCell>{cargoTypeId}</TableCell>
                    <TableCell>{type.nameEn || 'Not given'}</TableCell>
                    <TableCell>{type.nameRu || 'Not given'}</TableCell>
                    <TableCell>{type.nameTr || 'Not given'}</TableCell>
                    <TableCell>{type.nameTm || 'Not given'}</TableCell>
                    <TableCell>
                        <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => openEditCountry(type.uuid, type.nameEn, type.nameRu, type.nameTr, type.nameTm)}
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

        <Pagination count={total} page={currentPage} onChange={handlePageChange} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }} />

        <ConfirmationModal
            isOpen={selectedType !== null ? 'true' : undefined}
            onClose={() => setSelectedType(null)}
            onConfirm={handleConfirmDelete}
            message={'Are you sure to delete?'}
        />
        <AddTypeModal
            isopen={isAddTypeModalOpen.toString()}
            onClose={closeAddTypeModal}
        />
        <EditDangerousTypeModal
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
