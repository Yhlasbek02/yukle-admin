import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, right, left } from '../../utils/Icons';
import moment from 'moment';
import ConfirmationModal from '../ConfirmationModal/Modal';

export default function Cargos() {
  const { cargos, getCargos, deleteCargo } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
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
  const page = cargos.currentPage;
  const total = cargos.totalPages;
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 15 + 1);
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
        setStartIndex((newPage - 1) * 8 + 1);
        await getCargos(newPage);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <InnerLayout>
      <UserStyled>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cargos.cargos.map((cargo, index) => {
              const cargoId = index + startIndex;
              let typeName;
              if (cargo.type) {
                typeName = cargo.type.nameEn
              } else {
                typeName = 'Not given'
              }
              const fromCountryName = cargo.from_country.nameEn;
              const toCountryName = cargo.to_country.nameEn;
              const fromCityName = cargo.from_city.nameEn;
              const toCityName = cargo.to_city.nameEn;
              const date = moment(cargo.createdAt).format("YYYY-MM-DD");
              return (
                <tr key={cargoId}>
                  <td>{cargoId}</td>
                  <td>{cargo.name || 'Not given'}</td>
                  <td>{typeName || 'Not given'}</td>
                  <td>{cargo.email || 'Not given'}</td>
                  <td>{cargo.phoneNumber || 'Not given'}</td>
                  <td>{date || 'Not given'}</td>
                  <td>{fromCountryName || 'Not given'}, {fromCityName || 'Not given'}</td>
                  <td>{toCountryName || 'Not given'}, {toCityName || 'Not given'}</td>
                  <td>{cargo.weight || 'Not given'}</td>
                  <td>
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
                      onClick={() => handleDeleteClick(cargo.uuid)}
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
        isOpen={selectedCargo !== null ? 'true' : undefined}
        onClose={() => setSelectedCargo(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
      />
    </InnerLayout>
  )
}


const UserStyled = styled.div`
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
