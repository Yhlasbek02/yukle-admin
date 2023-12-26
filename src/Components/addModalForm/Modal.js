import React from 'react'
import styled from 'styled-components'

export default function Modal({ closeModal }) {
    return (
        <ModalStyled>
            <div className='modalBackground'>
                <div className='modalContainer'>
                    <button onClick={() => closeModal(false)}>X</button>
                    <div className='title'>
                        <h1>Add new transport type</h1>
                    </div>
                    <div className='body'>
                        <p>Add form</p>
                    </div>
                    <div className='footer'>
                        <button onClick={() => closeModal(false)}>Cancel</button>
                        <button>Save</button>
                    </div>
                </div>
            </div>
        </ModalStyled>

    )
}

const ModalStyled = styled.div`
    .modalBackground {
        width: 100vw;
        height: 100vh;
        background-color: rgba(200, 200, 200);
        position: relative;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .modalContainer {
        width: 500px;
        height: 500px;
        border-radius: 12px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        display: flex;
        flex-direction: column;
        padding: 25px;
    }
    .modalContainer .title {
        display: inline-block;
        text-align: center;
        margin-top: 10px;
    }
    .titleCloseBtn {
        display: flex;
        justify-content: flex-end;
    }

    .titleCloseBtn button {
        background-color: transparent;
        border: none;
        font-size: 25px;
    }
`;