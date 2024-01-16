import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { trash, left, right, answer } from '../../utils/Icons';
import moment from 'moment';
import ReplyModal from '../addModalForm/replyModal';
import ConfirmationModal from '../ConfirmationModal/Modal';
export default function Messages() {
  const { messages, getMessages, deleteMessage} = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMessages(currentPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentPage]);
  const page = messages.currentPage;
  const total = messages.totalPages;
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 8 + 1);
    try {
      await getMessages(newPage);
      
    } catch (error) {
      console.error(error);
    }
  };
  const handleAnswerClick = (id) => {
    setSelectedMessage(id);
    setOpenModal(true)
  };

  const closeModal = async () => {
    setOpenModal(false);
    setSelectedMessage(null);
  }

  const handleDeleteClick = (id) => {
    setDeleteMessageId(id);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteMessage(deleteMessageId);
      setDeleteMessageId(null);
      await getMessages(currentPage);
      if (messages.messages.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        setStartIndex((newPage - 1) * 8 + 1);
        await getMessages(newPage);
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
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.messages.map((message, index) => {
              const messageId = index + startIndex;
              const name = message.sender.name;
              const surname = message.sender.surname;
              const email = message.sender.email;
              const date = moment(message.createdAt).format("YYYY-MM-DD");
              const truncatedMessage =
                message.text.length > 50
                  ? `${message.text.substring(0, 50)}...`
                  : message.text;
              return (
                <tr key={messageId}>
                  <td>{messageId}</td>
                  <td>{name || ''} {surname || ''}</td>
                  <td>{email || 'Not given'}</td>
                  <td>{truncatedMessage}</td>
                  <td>{date || 'Not given'}</td>
                  <td>
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
                      onClick={() => handleAnswerClick(message.uuid)}
                    >
                      {answer}
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
                      onClick={() => handleDeleteClick(message.uuid)}
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
      <ReplyModal
        isopen={openModal.toString()}
        onClose={closeModal}
        messageId={selectedMessage}
      />
      <ConfirmationModal
        isOpen={deleteMessageId !== null ? 'true' : undefined}
        onClose={() => setDeleteMessageId(null)}
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

