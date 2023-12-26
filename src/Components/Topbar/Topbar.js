import React, { useEffect, useRef } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from '../../context/globalContext';
import { signout } from '../../utils/Icons';

export default function Topbar() {
    const { profile, getProfile, logout } = useGlobalContext();
    const navigate = useNavigate();
    let isCancelled = useRef(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            if (isCancelled.current) {
                isCancelled.current = false;
                getProfile();
            }
        }
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const username = profile?.username || '';
    const email = profile?.email || '';

    return (
        <TopStyled>
            <i className="fas fa-user-circle"></i>
            <div className='right'>
                <h2>{username}</h2>
                <p>{email}</p>
            </div>

            <div className='left'>
                <li onClick={handleLogout}>
                    {signout}
                </li>
            </div>
        </TopStyled>
    );
}

const TopStyled = styled.div`

  display: flex;
  padding: 0.5rem 1rem;
  top: 0;
  width: 100%;
  height: 3.5rem;
  background-color: rgba(77, 159, 255, 0.2);

  i {
    font-size: 2rem;
    padding: 10px;
  }

  h2 {
    font-size: 1rem;
    color: #4D9FFF;
  }
  p {
    font-size: 0.75rem;
  }
  .right {
    flex-grow: 1;
  }

  .left {
    float: left; /* Change to "float: right" for Sign Out on right */
  }

  body {
    font-family: sans-serif;
  }
  li {
    cursor: pointer;
  }
`;
