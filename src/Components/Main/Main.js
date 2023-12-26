import React, { useState, useMemo, useEffect } from 'react'
import styled from "styled-components";
import { MainLayout } from '../../styles/Layouts'
import Navigation from '../Navigation/Navigation'
import { useNavigate } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import Users from '../Users/Users';
import Transports from '../Transports/Transports';
import Cargos from '../Cargos/Cargos';
import Countries from '../Countries/Countries';
import Messages from '../Messages/Messages';
import TransportTypes from '../TransportTypes/TransportTypes';
import CargoTypes from '../CargoTypes/CargoTypes';
import Cities from '../Cities/Cities';

function Main() {
    const [active, setActive] = useState(1)
    const navigate = useNavigate();
    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            navigate('/login');
        }
    }, [navigate]);
    const displayData = () => {
        switch (active) {
            case 1:
                return <Users />
            case 2:
                return <Transports />
            case 3:
                return <Cargos />
            case 4:
                return <Countries />
            case 5: 
                return <Cities />
            case 6:
                return <Messages />
            case 7:
                return <TransportTypes />
            case 8:
                return <CargoTypes />
            default:
                return <Users />
        }
    }

    

    return (
        <AppStyled className="App">
            <Topbar />
            <MainLayout>
                <Navigation active={active} setActive={setActive} />
                <main>
                    {displayData()}
                </main>
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
    main{
      flex: 1;
      border-radius: 32px;
      overflow-x: hidden;
      &::-webkit-scrollbar{
        width: 0;
      }
    }
    body {
        padding: 0;
        margin: 0;
    }
  `;

export default Main;
