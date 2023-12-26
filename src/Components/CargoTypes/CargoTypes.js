import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, edit, left, right } from '../../utils/Icons';
import ConfirmationModal from '../ConfirmationModal/Modal';
export default function CargoTypes() {
  const { cargoTypes, getCargoTypes, deleteCargoType, editCargoTypes, addCargoType} = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [turkish, setTurkish] = useState('');
  const [selectedCargoType, setSelectedCargoType] = useState(null);
  const [editingCargoType, setEditingCargoType] = useState(null);
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
  const handleSave = async () => {
    try {
      if (editingCargoType) {
        await editCargoTypes(editingCargoType, english, russian, turkish);
      } else {
        await addCargoType(english, russian, turkish);
      }
      setEnglish('');
      setRussian('');
      setTurkish('');
      setEditingCargoType(null);
      await getCargoTypes(currentPage);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditClick = (id) => {
    const cargoTypeToEdit = cargoTypes.cargoTypes.find(type => type.uuid === id);
    setEnglish(cargoTypeToEdit.nameEn || '');
    setRussian(cargoTypeToEdit.nameRu || '');
    setTurkish(cargoTypeToEdit.nameTr || '');
    setEditingCargoType(id);
  }

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
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 8 + 1);
    try {
      await getCargoTypes(newPage);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <InnerLayout>
      <UserStyled>
        <div className='addForm'>
          <input placeholder='English' value={english} onChange={(e) => setEnglish(e.target.value)}></input>
          <input placeholder='Russian' value={russian} onChange={(e) => setRussian(e.target.value)}></input>
          <input placeholder='Turkish' value={turkish} onChange={(e) => setTurkish(e.target.value)}></input>
          <button onClick={handleSave}>Save</button>
        </div>
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
            {cargoTypes.cargoTypes.map((cargoType, index) => {
              const cargoTypeId = index + startIndex;
              return (
                <tr key={cargoTypeId}>
                  <td>{cargoTypeId}</td>
                  <td>{cargoType.nameEn || 'Not given'}</td>
                  <td>{cargoType.nameRu || 'Not given'}</td>
                  <td>{cargoType.nameTr || 'Not given'}</td>
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
                      onClick={() => handleEditClick(cargoType.uuid)}
                    >
                      {edit} Edit
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
                      onClick={() => handleDeleteClick(cargoType.uuid)}
                    >
                      {trash} Delete
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
        isOpen={selectedCargoType !== null ? 'true' : undefined}
        onClose={() => setSelectedCargoType(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
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

