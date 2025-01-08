import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { Button, TextField } from '@mui/material';

const ModalOverlay = styled.div.attrs((props) => ({
  style: {
    display: props.isopen === 'true' ? 'block' : 'none',
  },
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  z-index: 2;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    margin: 0;
  }

  button {
    padding: 8px;
    cursor: pointer;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 500px;
  overflow-y: auto;

  .user-message {
    background-color: #e0e0e0;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    width: 40%; /* Adjust the maximum width for user messages */
    align-self: flex-start;
  }

  .admin-message {
    background-color: #4caf50;
    color: #fff;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    width: 40%; /* Adjust the maximum width for admin messages */
    align-self: flex-end;
  }
`;

const ModalFooter = styled.div`
  text-align: right;
  display: flex;
  align-items: center;
  width: 100%;

  .text-field {
    flex: 1;
    margin-right: 1rem;
  }
`;

const ReplyModal = ({ isopen, onClose, messageId }) => {
  const { getSingleMessage, addMessage } = useGlobalContext();
  const [english, setEnglish] = useState('');
  const [messageData, setMessageData] = useState({});
  const [adminMessages, setAdminMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSingleMessage(messageId);
        setMessageData(response.data.message);
        setAdminMessages(response.data.adminMessages);
      } catch (error) {
        console.error(error);
      }
    };

    if (messageId) {
      fetchData();
    }
  }, [messageId]);

  const handleReply = async () => {
    try {
      await addMessage(messageId, english);
      setEnglish('');
      const updatedMessageData = await getSingleMessage(messageId);
      setMessageData(updatedMessageData.data.message);
      setAdminMessages(updatedMessageData.data.adminMessages);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalOverlay isopen={isopen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2 style={{ marginRight: '1.2rem' }}>Chat Center</h2>
          <Button variant="text" onClick={onClose}>X</Button>
        </ModalHeader>
        <ModalBody>
          {messageData && <div className="user-message">{messageData.text}</div>}
          {adminMessages.map((adminMessage) => (
            <div key={adminMessage.uuid} className="admin-message">
              {adminMessage.text}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <TextField
            className="text-field"
            variant="outlined"
            size="small"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="Type your reply..."
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleReply}
          >
            Reply
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ReplyModal;
