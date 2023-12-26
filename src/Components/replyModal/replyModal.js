import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  display: ${(props) => (props.isopen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 300px;
  padding: 20px;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  p {
    margin-bottom: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CancelButton = styled.button`
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  padding: 8px 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ReplyModal = ({ isOpen, onClose, onConfirm, adminMessages, message }) => {
    return (
        <ModalOverlay isopen={isOpen} onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {adminMessages.map((adminMessage, index) => (
                    <p key={`admin-${index}`}>{adminMessage}</p>
                ))}
                {message.map((msg, index) => (
                    <p key={`message-${index}`}>{msg}</p>
                ))}
                <ButtonContainer>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ReplyModal;
