import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

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
    max-width: 70%; /* Adjust the maximum width for user messages */
    align-self: flex-start;
  }

  .admin-message {
    background-color: #4caf50;
    color: #fff;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    max-width: 70%; /* Adjust the maximum width for admin messages */
    align-self: flex-end;
  }
  
`;

const ModalFooter = styled.div`
  text-align: right;
  display: flex;
  width: 100%;

  button {
    padding: 8px 15px;
    cursor: pointer;
    background-color: #4caf50;
    color: #fff;
    border: none;
    font-size: 1.2rem;
    border-radius: 4px;
    outline: none;
  }
  input {
    margin-right: 1rem;
    width: 80%;
    padding: 8px 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;


const ReplyModal = ({ isopen, onClose, messageId }) => {
    const { getSingleMessage, addMessage, singleMessage } = useGlobalContext();
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

    useEffect(() => {
        console.log(messageData, adminMessages);
    }, [messageData, adminMessages]);


    const handleReply = async () => {
        try {
            await addMessage(messageId, english);
            setEnglish('');
            console.log('Replied');
            await getSingleMessage(messageId);
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
                    <h2 style={{ marginRight: "1.2rem" }}>Chat center</h2>
                    <button onClick={onClose}>X</button>
                </ModalHeader>
                <ModalBody>
                    {messageData && (
                        <div className="user-message">{messageData.text}</div>
                    )}
                    {adminMessages.map((adminMessage) => (
                        <div key={adminMessage.uuid} className="admin-message">
                            {adminMessage.text}
                        </div>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <input type="text" value={english} onChange={(e) => setEnglish(e.target.value)} id="english" />
                    <button onClick={handleReply}>Reply</button>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};


export default ReplyModal;
