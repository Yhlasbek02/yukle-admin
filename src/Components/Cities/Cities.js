import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, get, left, right } from '../../utils/Icons';

export default function Cities() {
    const { cities, getCities, allCountries, getAllCountries, addCity, deleteCity } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [editingCity, setEditingCity] = useState(null);
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [turkish, setTurkish] = useState('');
    const [countryId, setCountryId] = useState('');

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



    const handleCountryChange = (event) => {
        const selectedCountryId = event.target.value;
        const selectedCountryObj = allCountries.countries.find(
            (country) => country.uuid === selectedCountryId
        );
        setSelectedCountry(selectedCountryObj);
        setCurrentPage(1);
    };

    const selectCountry = (event) => {
        const selectedCountryId = event.target.value;
        const selectedCountryObj = allCountries.countries.find(
            (country) => country.id === selectedCountryId
        );
        setCountryId(selectedCountryObj);
    };

    useEffect(() => {
        const fetchData = async () => {

            try {
                if (selectedCountry) {
                    await getCities(selectedCountry.uuid, currentPage);
                } else {
                    await getCities('', currentPage);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentPage, selectedCountry]);

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
            await getCities(currentPage);
        } catch (error) {
            console.log(error);
        }
    }
    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 8 + 1);
        try {
            if (selectedCountry) {
                await getCities(selectedCountry.uuid, newPage);
            } else {
                await getCities('', newPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (id) => {
        const cityToEdit = cities.cities.find(type => type.uuid === id);
        setEnglish(cityToEdit.nameEn || '');
        setRussian(cityToEdit.nameRu || '');
        setTurkish(cityToEdit.nameTr || '');
        setCountryId(cityToEdit.countryId || '');
        setEditingCity(id);
    }

    const handleDeleteClick = (id) => {
        setSelectedCity(id);
    };
    const handleConfirmDelete = async () => {
        try {
            await deleteCity(selectedCity);
            setSelectedCity(null);
            await getCities(currentPage);
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
                    <select id="country" onChange={selectCountry}>
                        <option value={null}>-- Select Country --</option>
                        {allCountries.countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.nameEn}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSave}>Save</button>
                </div>
                <div className="country-select">
                    <select id="country" onChange={handleCountryChange}>
                        <option value={null}>-- Select Country --</option>
                        {allCountries.countries.map((country) => (
                            <option key={country.uuid} value={country.uuid}>
                                {country.nameEn}
                            </option>
                        ))}
                    </select>
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
                        {cities.cities.map((city, index) => {
                            const cityId = index + startIndex;
                            return (
                                <tr key={cityId}>
                                    <td>{cityId}</td>
                                    <td>{city.nameEn || 'Not given'}</td>
                                    <td>{city.nameRu || 'Not given'}</td>
                                    <td>{city.nameTr || 'Not given'}</td>
                                    <td>{get} {trash}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className='pagination'>
                    <button
                        onClick={() => handlePageChange(cities.currentPage - 1)}
                        disabled={parseInt(cities.currentPage) === 1}
                    >
                        {left}
                    </button>
                    <span> Page {cities.currentPage} of {cities.totalPages} </span>
                    <button
                        onClick={() => handlePageChange(parseInt(cities.currentPage) + 1)}
                        disabled={parseInt(cities.currentPage) === parseInt(cities.totalPages)}
                    >
                        {right}
                    </button>
                </div>
            </UserStyled>
        </InnerLayout>
    )
}

const UserStyled = styled.div`
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
        }
    }
`;
