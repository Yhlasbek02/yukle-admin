import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { menuItems } from '../../utils/menuItems'
import { useGlobalContext } from '../../context/globalContext'
import { useNavigate } from 'react-router-dom';
function Navigation({ active, setActive }) {
    return (
        <NavStyled>
            <ul className="menu-items">
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                         <span>{item.title}</span>
                    </li>
                })}
            </ul>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1rem;
    width: 250px;
    height: 100vh;
    background: #4D9FFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    .menu-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        li{
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .2s ease-in-out;
            color: rgba(255, 255, 255, 0.6);
            padding-left: 1rem;
            position: relative;
        }
    }

    .active{
        padding-left: 1.7rem;
        color: #ffffff !important;
        justify-content: center:
        align-items: center;
        flex-direction: column;
        font-size: 1.4rem;
        &::before{
            
            content: "";
            margin: .5rem 0;
            width: 1rem;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            left: 0;
            top: 0;
            height: 1rem;
            background: #fff;
            justify-content: center;
            align-items: center;
        }
        > span {
            padding-left: 10px;
        }
    }
    .bottom-nav {
        cursor: pointer
    }
`;

export default Navigation