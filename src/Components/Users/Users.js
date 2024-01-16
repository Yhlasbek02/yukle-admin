import React, { useEffect, useState } from 'react';
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, edit, left, right } from '../../utils/Icons';
import ConfirmationModal from '../ConfirmationModal/Modal';
export default function Users() {
    const { users, getUsers, deleteUser, changePaid } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsers(currentPage);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentPage]);
    const page = users.currentPage;
    const total = users.totalPages;

    if (users === null || users === undefined) {
        return <p>Loading...</p>;
    }

    const handlePageChange = async (newPage) => {
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 10 + 1);
        try {
            await getUsers(newPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedUser(id);
    };

    const handlePaidClick = (id) => {
        setSelectedUser(id);
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedUser);
            setSelectedUser(null);
            await getUsers(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmPaid = async () => {
        try {
            await changePaid(selectedUser);
            setSelectedUser(null);
            await getUsers(currentPage);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <InnerLayout>
            <UserStyled>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Paid</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.users.map((user, index) => {
                            const userId = startIndex + index;
                            return (
                                <tr key={userId}>
                                    <td>{userId}</td>
                                    <td>{user.name || 'Not given'}</td>
                                    <td>{user.surname || 'Not given'}</td>
                                    <td>{user.email || 'Not given'}</td>
                                    <td>{user.phoneNumber || 'Not given'}</td>
                                    <td>{user.paid ? <p style={{color: "blue"}}>true</p> : <p style={{color: "red"}}>false</p>}</td>
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
                                            onClick={() => handleDeleteClick(user.uuid)}
                                        >
                                            {trash}
                                        </button>
                                        <button
                                            style={{
                                                padding: '4px 12px',
                                                fontSize: '1rem',
                                                backgroundColor: 'blue',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '10px',
                                            }}
                                            onClick={() => handlePaidClick(user.uuid)}
                                        >
                                            {edit}
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
                isOpen={selectedUser !== null ? 'true' : undefined}
                onClose={() => setSelectedUser(null)}
                onConfirm={handleConfirmDelete}
                message={'Are you sure to delete?'}
            />

            <ConfirmationModal
                isOpen={selectedUser !== null ? 'true' : undefined}
                onClose={() => setSelectedUser(null)}
                onConfirm={handleConfirmPaid}
                message={'Are you sure to change paid status'}
            />
        </InnerLayout>
    );
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
