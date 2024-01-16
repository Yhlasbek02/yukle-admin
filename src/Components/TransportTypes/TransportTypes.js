import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, left, right, edit } from '../../utils/Icons';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddTypeModal from '../addModalForm/addTransportType';
import EditTransportTypeModal from '../addModalForm/editTransportType';
export default function TransportTypes() {
  const { transportTypes, getTransportTypes, addTransportType, deleteTransportType, editTransportTypes } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
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

  const openEditType = (typeId, english, russian, turkish) => {
    setIdEdit(typeId);
    setEnglish(english);
    setRussian(russian);
    setTurkish(turkish);
    setEditTypeModal(true);
  }

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
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 8 + 1);
    try {
      await getTransportTypes(newPage);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <InnerLayout>
      <UserStyled>
        
          <button style={{marginBottom: "10px"}} onClick={openAddTypeModal}>Add Transport Type</button>
        
      
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>English</th>
              <th>Russian</th>
              <th>Turkish</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transportTypes.transportTypes.map((transportType, index) => {
              const transportTypeId = index + startIndex;
              return (
                <tr key={transportTypeId}>
                  <td>{transportTypeId}</td>
                  <td>{transportType.nameEn || 'Not given'}</td>
                  <td>{transportType.nameRu || 'Not given'}</td>
                  <td>{transportType.nameTr || 'Not given'}</td>
                  <td>
                    <button
                      style={{
                        padding: '4px 12px',
                        fontSize: '1rem',
                        backgroundColor: '#3498db',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                      }}
                      onClick={() => openEditType(transportType.uuid, transportType.nameEn, transportType.nameRu, transportType.nameTr)}
                    >
                      {edit}
                    </button>
                    <button
                      style={{
                        padding: '4px 12px',
                        fontSize: '1rem',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px',
                      }}
                      onClick={() => handleDeleteClick(transportType.uuid)}
                    >
                      {trash}
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className='pagination'>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={parseInt(page) === 1}
          >
            {left}
          </button>
          <span> Page {page} of {total} </span>
          <button
            onClick={() => handlePageChange(parseInt(page) + 1)}
            disabled={parseInt(page) === parseInt(total)}
          >
            {right}
          </button>
        </div>
      </UserStyled>
      <ConfirmationModal
        isOpen={selectedTransportType !== null ? 'true' : undefined}
        onClose={() => setSelectedTransportType(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
      />
      <AddTypeModal
        isopen={isAddTypeModal.toString()}
        onClose={closeAddTypeModal}
      />
      <EditTransportTypeModal
        isopen={isEditTypeModal.toString()}
        onClose={closeEditTypeModal}
        typeId={idEdit}
        englishData={english}
        russianData={russian}
        turkishData={turkish}
      />
    </InnerLayout>
  )
}

const UserStyled = styled.div`
    .addForm {
      display: flex;
      width: 75%;
      margin-bottom: 1rem;
    }
    .addForm input {
      width: 33%;
      height: 30px;
      margin-right: 10px;
      border-radius: 4px;
      padding: 0.5rem;
    }
    .pagination {
      justify-content: center;
      align-items: center;
    }
    span {
        padding: 0 0.5rem;
        margin-top: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        color: #000;
        margin-bottom: 1rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.6rem;
    }

    th, td {
      font-size: 0.85rem;
        padding: 0.55rem;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }

    td {
      widht: 20%
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tr:hover {
        background-color: #f0f0f0;
    }

    p {
        margin-top: 1rem;
        font-size: 1rem;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.75rem;
    }

    button {
        padding: 0.5rem 1rem;
        cursor: pointer;
        background-color: #4caf50;
        color: #fff;
        border: none;
        border-radius: 4px;
        outline: none;
        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }
`;

