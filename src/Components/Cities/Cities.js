import React, { useEffect, useState } from 'react';
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, edit, left, right } from '../../utils/Icons';
import ConfirmationModal from '../ConfirmationModal/Modal';
import AddCityModal from '../addModalForm/addModal';
import EditCityModal from '../addModalForm/editCityModal';
import _debounce from 'lodash.debounce';
import axios from 'axios';

export default function Cities() {
    const {
        cities,
        getCities,
        allCountries,
        getAllCountries,
        addCity,
        deleteCity,
        editCity,
    } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [editingCity, setEditingCity] = useState(null);
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [countryId, setCountryId] = useState('');
    const [id, setId] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [englishEdit, setEnglishEdit] = useState('');
    const [russianEdit, setRussianEdit] = useState('');
    const [turkishEdit, setTurkishEdit] = useState('');
    const [countryIdEdit, setCountryIdEdit] = useState('');
    const [isAddCityModalOpen, setAddCityModalOpen] = useState(false);
    const [isEditCityModal, setEditCityModal] = useState(false);

    const debouncedFetchData = _debounce(fetchData, 300);
    let cancelFetch;

    useEffect(() => {
        debouncedFetchData();
    }, [currentPage, selectedCountry, searchKey]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getAllCountries();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    async function fetchData() {
        try {
            if (cancelFetch) {
                cancelFetch();
            }

            const source = axios.CancelToken.source();
            cancelFetch = source.cancel;

            let updatedTotalPages;
            if (selectedCountry) {
                updatedTotalPages = await getCities(
                    selectedCountry.uuid,
                    currentPage,
                    searchKey,
                    { cancelToken: source.token }
                );
            } else {
                updatedTotalPages = await getCities('', currentPage, searchKey, {
                    cancelToken: source.token,
                });
            }

            if (searchKey && currentPage > updatedTotalPages) {
                setCurrentPage(updatedTotalPages);
                // Ensure startIndex is at least 1
                const newStartIndex = Math.max((updatedTotalPages - 1) * 8 + 1, 1);
                setStartIndex(newStartIndex);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                // Handle cancelation
            } else {
                console.error(error);
            }
        }
    }

    const openAddCityModal = () => {
        setAddCityModalOpen(true);
    };

    const openEditCity = (id, english, russian, turkish, countryId) => {
        setId(id);
        setEnglishEdit(english);
        setRussianEdit(russian);
        setTurkishEdit(turkish);
        setCountryIdEdit(countryId);
        setEditCityModal(true);
    };

    const closeEditModal = async () => {
        setEditCityModal(false);
        if (selectedCountry) {
            await getCities(selectedCountry.uuid, currentPage, searchKey);
        } else {
            await getCities('', currentPage, searchKey);
        }
        
    };

    const closeAddCityModal = () => {
        setAddCityModalOpen(false);
    };

    const handleCountryChange = (event) => {
        const selectedCountryId = event.target.value;
        const selectedCountryObj = allCountries.countries.find(
            (country) => country.uuid === selectedCountryId
        );
        setSelectedCountry(selectedCountryObj);
        setCurrentPage(1);
    };

    const handleSave = async () => {
        try {
            if (editingCity) {
                await editCity(editingCity, english, russian, turkish, countryId);
            } else {
                await addCity(english, russian, turkish, countryId);
            }
            setEnglish('');
            setRussian('');
            setTurkish('');
            setCountryId(null);
            setEditingCity(null);
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, currentPage);
            } else {
                await getCities('', currentPage);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 8 + 1);
        try {
            if (selectedCountry) {
                await getCities(newPage, searchKey, selectedCountry.uuid);
            } else {
                const country = '';
                await getCities(newPage, searchKey, country);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };

    const handleDeleteClick = (id) => {
        setSelectedCity(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCity(selectedCity);
            setSelectedCity(null);
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, currentPage);
            } else {
                await getCities('', currentPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <InnerLayout>
            <UserStyled>
                <div className="country-select">
                    <div>
                        <label>Filter: </label>
                        <select id="country" onChange={handleCountryChange}>
                            <option value={null}>-- Select Country --</option>
                            {allCountries.countries.map((country) => (
                                <option key={country.uuid} value={country.uuid}>
                                    {country.nameEn}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        placeholder="Search..."
                        type="text"
                        id="search"
                        value={searchKey}
                        onChange={handleSearchChange}
                    />
                    <button onClick={openAddCityModal}>Add City</button>
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
                        {cities.cities
                            .filter(
                                (city) =>
                                    city.nameEn.toLowerCase().includes(searchKey.toLowerCase()) ||
                                    city.nameRu.toLowerCase().includes(searchKey.toLowerCase()) ||
                                    city.nameTr.toLowerCase().includes(searchKey.toLowerCase())
                            )
                            .map((city, index) => {
                                const cityId = index + startIndex;
                                const truncatedEn =
                                    city.nameEn.length > 20
                                        ? `${city.nameEn.substring(0, 20)}...`
                                        : city.nameEn;
                                const truncatedRu =
                                    city.nameRu.length > 20
                                        ? `${city.nameRu.substring(0, 20)}...`
                                        : city.nameRu;
                                const truncatedTr =
                                    city.nameTr.length > 20
                                        ? `${city.nameTr.substring(0, 20)}...`
                                        : city.nameTr;
                                return (
                                    <tr key={cityId}>
                                        <td>{cityId}</td>
                                        <td>{truncatedEn || 'Not given'}</td>
                                        <td>{truncatedRu || 'Not given'}</td>
                                        <td>{truncatedTr || 'Not given'}</td>
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
                                                onClick={() =>
                                                    openEditCity(
                                                        city.uuid,
                                                        city.nameEn,
                                                        city.nameRu,
                                                        city.nameTr,
                                                        city.country.id
                                                    )
                                                }
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
                                                onClick={() => handleDeleteClick(city.uuid)}
                                            >
                                                {trash}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(cities.currentPage - 1)}
                        disabled={parseInt(cities.currentPage) === 1}
                    >
                        {left}
                    </button>
                    <span>
                        {' '}
                        Page {cities.currentPage} of {cities.totalPages}{' '}
                    </span>
                    <button
                        onClick={() => handlePageChange(parseInt(cities.currentPage) + 1)}
                        disabled={parseInt(cities.currentPage) === parseInt(cities.totalPages)}
                    >
                        {right}
                    </button>
                </div>
            </UserStyled>
            <ConfirmationModal
                isOpen={selectedCity !== null ? 'true' : undefined}
                onClose={() => setSelectedCity(null)}
                onConfirm={handleConfirmDelete}
                message={'Are you sure to delete?'}
            />
            <AddCityModal
                isopen={isAddCityModalOpen.toString()}
                onClose={closeAddCityModal}
                onSave={handleSave}
            />
            <EditCityModal
                isopen={isEditCityModal.toString()}
                onClose={closeEditModal}
                cityId={id}
                englishData={englishEdit}
                russianData={russianEdit}
                turkishData={turkishEdit}
                countryId={countryIdEdit}
            />
        </InnerLayout>
    );
}

const UserStyled = styled.div`
  #search {
    padding: 0.5rem;
    width: 30%;
    border-radius: 10px;
  }
  .addForm {
    display: flex;
    width: 100%;
    margin-bottom: 1rem;
  }
  .addForm input {
    width: 33%;
    height: 35px;
    margin-right: 10px;
    border-radius: 4px;
    padding: 0.5rem;
  }
  .addForm select {
    height: 35px;
    padding: 0.5rem;
    border-radius: 4px;
    margin-right: 10px;
  }
  .addForm button {
    height: 35px;
    font-size: 15px;
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

  th,
  td {
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
  .country-select {
    margin-bottom: 1rem;

    label {
      margin-right: 0.5rem;
    }

    select {
      padding: 0.5rem;
      border-radius: 10px;
    }
  }
`;
