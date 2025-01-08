import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import { trash, left, right, answer } from '../../utils/Icons';
import moment from 'moment';
import ReplyModal from '../addModalForm/replyModal';
import ConfirmationModal from '../ConfirmationModal/Modal';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Typography } from '@mui/material';
import { Delete, Message } from '@mui/icons-material';

export default function Messages() {
  const { messages, getMessages, deleteMessage } = useGlobalContext();
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
    setStartIndex((newPage - 1) * 6 + 1);
    try {
      await getMessages(newPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerClick = (id) => {
    setSelectedMessage(id);
    setOpenModal(true);
  };

  const closeModal = async () => {
    setOpenModal(false);
    setSelectedMessage(null);
  };

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
        setStartIndex((newPage - 1) * 6 + 1);
        await getMessages(newPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <InnerLayout>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{background: "blue"}}>
              <TableCell sx={{color: "#fff"}}>ID</TableCell>
              <TableCell sx={{color: "#fff"}}>Name</TableCell>
              <TableCell sx={{color: "#fff"}}>Email</TableCell>
              <TableCell sx={{color: "#fff"}}>Message</TableCell>
              <TableCell sx={{color: "#fff"}}>Date</TableCell>
              <TableCell sx={{color: "#fff"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                <TableRow key={messageId}>
                  <TableCell>{messageId}</TableCell>
                  <TableCell>{name || ''} {surname || ''}</TableCell>
                  <TableCell>{email || 'Not given'}</TableCell>
                  <TableCell>{truncatedMessage}</TableCell>
                  <TableCell>{date || 'Not given'}</TableCell>
                  <TableCell>
                    <Button
                      sx={{ mr: 2, backgroundColor: 'blue', color: '#fff' }}
                      onClick={() => handleAnswerClick(message.uuid)}
                    >
                      <Message />
                    </Button>
                    <Button
                      sx={{ backgroundColor: '#e74c3c', color: '#fff' }}
                      onClick={() => handleDeleteClick(message.uuid)}
                    >
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={parseInt(page) === 1}
          >
            {`<`}
          </Button>
          <Typography variant="body2" sx={{ mx: 2 }}>
            Page {page} of {total}
          </Typography>
          <Button
            onClick={() => handlePageChange(parseInt(page) + 1)}
            disabled={parseInt(page) === parseInt(total)}
          >
            {`>`}
          </Button>
        </Box>
      </Box>

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
  );
}
