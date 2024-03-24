import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "http://216.250.11.247:8080/api/admin/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [users, setUsers] = useState({ users: [], totalPages: 1, currentPage: 1, totalUsers: 1 });
    const [transports, setTransports] = useState({ transports: [], totalTransport: 1, currentPage: 1, totalPages: 1 });
    const [singleTransport, setSingleTransport] = useState([])
    const [cargos, setCargos] = useState({ cargos: [], totalPages: 1, totalCargos: 1, currentPage: 1 });
    const [singleCargo, setSingleCargo] = useState([])
    const [countries, setCountries] = useState({ countries: [], totalPages: 1, totalCountry: 1, currentPage: 1 })
    const [allCountries, setAllCountries] = useState({ countries: [], totalPages: 1, totalCountry: 1, currentPage: 1 })
    const [cities, setCities] = useState({ cities: [], totalPages: 1, totalCities: 1, currentPage: 1 })
    const [messages, setMessages] = useState({ messages: [], totalMessages: 1, currentPage: 1, totalPages: 1 });
    const [singleMessage, setSingleMessage] = useState({ message: {}, adminMessages: []});
    const [cargoTypes, setCargoTypes] = useState({ cargoTypes: [], totalPages: 1, currentPage: 1, totalCargoTypes: 1 });
    const [transportTypes, setTransportTypes] = useState({ transportTypes: [], totalPages: 1, totalTransportTypes: 1, currentPage: 1 });
    const [profile, setProfile] = useState([])
    const [error, setError] = useState(null)

    const login = async (admin) => {
        try {
            const response = await axios.post(`${BASE_URL}login`, admin)
                .catch((err) => {
                    setError(err.response.data.message)
                });
            if (response && response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }

    }

    const logout = async () => {
        try {
            localStorage.removeItem('token');
        } catch (error) {
            setError(error.response?.data?.message || 'Logout failed');
        }
    }

    const forgotPassword = async (email) => {
        try {
            await axios.post(`${BASE_URL}forgot-password`, email)
                .catch((err) => {
                    setError(err.response.data.message);
                });
        } catch (error) {
            setError(error.response?.data?.message || "Can't send code");
        }
    }

    const verifyCode = async (code) => {
        try {
            const response = await axios.post(`${BASE_URL}verify`, code)
                .catch((err) => {
                    setError(err.response.data.message)
                });
            if (response && response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Verification error");
        }
    }

    const getProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}profile`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message)
                });
            setProfile(response.data)
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Profile error");
        }
    }

    const changePassword = async (password) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}change-password`, password,
                {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                }
            )
                .catch((err) => {
                    setError(err.response.data.message)
                })
            setUsers(response.data);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Change password error");
        }
    }

    const getUsers = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}users?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            setUsers({
                users: response.data.users,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalUsers: response.data.totalUsers

            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Users error");
        }
    }

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}users/delete/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Users error");
        }
    }

    const changePaid = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}users/change-paid/${id}`, {}, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Users error");
        }
    }

    const getTransports = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}transport?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message)
                })
            setTransports({
                transports: response.data.transports,
                totalTransport: response.data.totalTransport,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transports error");
        }

    }

    const getSingleTransport = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}transport/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setSingleTransport(response.data);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport error");
        }
    }

    const deleteTransport = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}transport/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message || 'Delete transport error')
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }

    }

    const getCargos = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}cargo?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setCargos({
                cargos: response.data.cargos,
                totalPages: response.data.totalPages,
                totalCargos: response.data.totalCargos,
                currentPage: response.data.currentPage,
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Cargo error");
        }
    }

    const getSingleCargo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}cargo/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setSingleCargo(response.data);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport error");
        }
    }

    const deleteCargo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}cargo/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message || 'Delete cargo error')
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }

    }

    const getTransportTypes = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}transport-type?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setTransportTypes({
                transportTypes: response.data.transportTypes,
                totalPages: response.data.totalPages,
                totalTransportTypes: response.data.totalTransportTypes,
                currentPage: response.data.currentPage,
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Cargo error");
        }
    }

    const addTransportType = async (english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}transport-type/add`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            await getTransportTypes(1);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport type error");
        }
    }

    const deleteTransportType = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${BASE_URL}transport-type/delete/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            getTransportTypes(1);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport type error");
        }
    }

    const editTransportTypes = async (id, english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${BASE_URL}transport-type/edit/${id}`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport type error");
        }
    }

    const editCargoTypes = async (id, english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${BASE_URL}cargo-type/edit/${id}`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Transport type error");
        }
    }

    const getCargoTypes = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}cargo-type?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setCargoTypes({
                cargoTypes: response.data.cargoTypes,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalCargoTypes: response.data.totalCargoTypes
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Cargo type error");
        }
    }

    const addCargoType = async (english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}cargo-type/add`,
                {
                    nameEn: english,
                    nameRu: russian,
                    nameTr: turkish
                }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            await getCargoTypes(1)
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Cargo type add error");
        }
    }

    const deleteCargoType = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${BASE_URL}cargo-type/delete/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            await getCargoTypes(1);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Cargo type delete error");
        }
    }

    const getCountries = async (page, searchKey) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}country?page=${page}&searchKey=${searchKey}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setCountries({
                countries: response.data.countries,
                totalPages: response.data.totalPages,
                totalCountry: response.data.totalCountry,
                currentPage: response.data.currentPage
            });

            return response.data.totalPages;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Countries error");
        }
    }

    const getAllCountries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}country?pageSize=250`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setAllCountries({
                countries: response.data.countries,
                totalPages: response.data.totalPages,
                totalCountry: response.data.totalCountry,
                currentPage: response.data.currentPage
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Countries error");
        }
    }

    const addCountry = async (english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}country/add`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const deleteCountry = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${BASE_URL}country/delete/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const editCountry = async (id, english, russian, turkish) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${BASE_URL}country/edit/${id}`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const getCities = async (country, page, searchKey) => {
        try {
            const token = localStorage.getItem('token');
            let url = `${BASE_URL}country/cities?page=${page}&searchKey=${searchKey}&country=${country}`;
            const response = await axios.get(url, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            setCities({
                cities: response.data.cities,
                totalCities: response.data.totalCities,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage
            });

            return response.data.totalPages;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    };


    const addCity = async (english, russian, turkish, countryId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}country/add-city`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish,
                countryId: countryId.id
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const editCity = async (id, english, russian, turkish, countryId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}country/edit-city/${id}`, {
                nameEn: english,
                nameRu: russian,
                nameTr: turkish,
                countryId: countryId
            }, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const deleteCity = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}country/delete-city/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const addMessage = async (id, message) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}chat/add/${id}`, {text: message, messageId: id}, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const getMessages = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}chat/all?page=${page}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
            setMessages({
                messages: response.data.messages,
                totalMessages: response.data.totalMessages,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage
            });
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const getSingleMessage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}chat/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
                
            setSingleMessage({
                adminMessages: response.data.adminMessages,
                message: response.data.message
                
            });
            console.log(response.data.message);
            return response;
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    }

    const deleteMessage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}chat/delete/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .catch((err) => {
                    setError(err.response.data.message);
                })
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Server error");
        }
    } 


    return (
        <GlobalContext.Provider value={{
            transports,
            setTransports,
            getTransports,
            transportTypes,
            setTransportTypes,
            getTransportTypes,
            cargoTypes,
            setCargoTypes,
            getCargoTypes,
            messages,
            setMessages,
            getMessages,
            countries,
            setCountries,
            getCountries,
            cities,
            setCities,
            getCities,
            error,
            setError,
            cargos,
            setCargos,
            getCargos,
            login,
            logout,
            setProfile,
            profile,
            getProfile,
            users,
            getUsers,
            setUsers,
            singleCargo,
            setSingleCargo,
            getSingleCargo,
            addCargoType,
            addCity,
            addCountry,
            addMessage,
            addTransportType,
            editCity,
            editCountry,
            deleteCargo,
            deleteCargoType,
            deleteCity,
            deleteCountry,
            deleteTransport,
            deleteTransportType,
            getSingleMessage,
            getSingleTransport,
            verifyCode,
            forgotPassword,
            changePassword,
            singleTransport,
            allCountries,
            getAllCountries,
            setAllCountries,
            editCargoTypes,
            editTransportTypes,
            setSingleMessage,
            singleMessage,
            deleteUser,
            changePaid,
            deleteMessage
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}