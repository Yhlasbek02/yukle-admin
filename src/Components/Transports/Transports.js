import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, get, left, right } from '../../utils/Icons';
import moment from 'moment';
import ConfirmationModal from '../ConfirmationModal/Modal';
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
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 15 + 1);
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
              <th>Location</th>
              <th>BelongsTo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transports.transports.map((transport, index) => {
              const transportId = index + startIndex;
              let typeName;
              if (transport.type) {
                typeName = transport.type.nameEn
              } else {
                typeName = 'Not given'
              }
              const locationName = transport.location_country.nameEn;
              const locationCity = transport.location_city.nameEn;
              const belongsToName = transport.affiliation_country.nameEn;
              const date = moment(transport.createdAt).format("YYYY-MM-DD");
              return (
                <tr key={transportId}>
                  <td>{transportId}</td>
                  <td>{transport.name || 'Not given'}</td>
                  <td>{typeName}</td>
                  <td>{transport.email || 'Not given'}</td>
                  <td>{transport.phoneNumber || 'Not given'}</td>
                  <td>{date || 'Not given'}</td>
                  <td>{locationName || 'Not given'}, {locationCity || 'Not given'}</td>
                  <td>{belongsToName || 'Not given'}</td>
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
                      onClick={() => handleDeleteClick(transport.uuid)}
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
        isOpen={selectedTransport !== null ? 'true' : undefined}
        onClose={() => setSelectedTransport(null)}
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
