import React, { useEffect, useState } from 'react';
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, left, right, edit } from '../../utils/Icons';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddCountryModal from '../addModalForm/Modal';
import EditCountryModal from '../addModalForm/editCountryModal';
export default function Countries() {
  const { countries, getCountries, deleteCountry } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [englishEdit, setEnglishEdit] = useState('');
  const [russianEdit, setRussianEdit] = useState('');
  const [turkishEdit, setTurkishEdit] = useState('');
  const [countryIdEdit, setCountryIdEdit] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [isAddCountryModalOpen, setAddCountryModalOpen] = useState(false);
  const [isEditCountryModal, setEditCountryModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedTotalPages = await getCountries(currentPage, searchKey);
        if (searchKey && currentPage > updatedTotalPages) {
          setCurrentPage(updatedTotalPages);
          setStartIndex((updatedTotalPages - 1) * 8 + 1);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage, searchKey]);
  const openAddCountryModal = () => {
    setAddCountryModalOpen(true);
  };

  const openEditCountry = (countryId, english, russian, turkish) => {
    setCountryIdEdit(countryId);
    setEnglishEdit(english);
    setRussianEdit(russian);
    setTurkishEdit(turkish);
    setEditCountryModal(true);
  }

  const closeAddCountryModal = async () => {
    setAddCountryModalOpen(false);
    await getCountries(currentPage, searchKey);
  };

  const closeEditModal = async () => {
    setEditCountryModal(false);
    await getCountries(currentPage, searchKey);
  }

  const page = countries.currentPage;
  const total = countries.totalPages;
  const handleDeleteClick = (id) => {
    setSelectedCountry(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCountry(selectedCountry);
      setSelectedCountry(null);
      await getCountries(currentPage, searchKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 7 + 1);
    try {
      await getCountries(newPage, searchKey);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchKey(event.target.value);
  };

  return (
    <InnerLayout>
      <UserStyled>
        <div style={{marginBottom: "1rem"}}>
          <input
            type="text"
            id="search"
            value={searchKey}
            onChange={handleSearchChange}
            placeholder='Search...'
            style={{padding: "0.5rem", borderRadius: "10px", width: "30%"}}
          />
          <button onClick={openAddCountryModal}>Add Country</button>
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
            {countries.countries
              .filter(
                (country) =>
                  country.nameEn.toLowerCase().includes(searchKey.toLowerCase()) ||
                  country.nameRu.toLowerCase().includes(searchKey.toLowerCase()) ||
                  country.nameTr.toLowerCase().includes(searchKey.toLowerCase())
              )
              .map((country, index) => {
                const transportId = index + startIndex;
                return (
                  <tr key={transportId}>
                    <td>{transportId}</td>
                    <td>{country.nameEn || 'Not given'}</td>
                    <td>{country.nameRu || 'Not given'}</td>
                    <td>{country.nameTr || 'Not given'}</td>
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
                        onClick={() => openEditCountry(country.uuid, country.nameEn, country.nameRu, country.nameTr)}
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
                        onClick={() => handleDeleteClick(country.uuid)}
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
        isOpen={selectedCountry !== null ? 'true' : undefined}
        onClose={() => setSelectedCountry(null)}
        onConfirm={handleConfirmDelete}
        message={'Are you sure to delete?'}
      />
      <AddCountryModal
        isopen={isAddCountryModalOpen.toString()}
        onClose={closeAddCountryModal}
      />
      <EditCountryModal
        isopen={isEditCountryModal.toString()}
        onClose={closeEditModal}
        countryId={countryIdEdit}
        englishData={englishEdit}
        russianData={russianEdit}
        turkishData={turkishEdit}
      />
    </InnerLayout>
  );
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
