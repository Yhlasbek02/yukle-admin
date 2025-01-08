import React from 'react';
import { Box, List, ListItem, ListItemText, styled } from '@mui/material';
import { menuItems } from '../../utils/menuItems';

function Navigation({ active, setActive }) {
    return (
        <NavContainer>
            <List>
                {menuItems.map((item) => (
                    <StyledListItem
                        key={item.id}
                        selected={active === item.id}
                        onClick={() => setActive(item.id)}
                    >
                        <ListItemText
                            primary={item.title}
                            primaryTypographyProps={{
                                fontSize: '1rem',
                                fontWeight: active === item.id ? 'bold' : 'medium',
                                color: active === item.id ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                            }}
                        />
                    </StyledListItem>
                ))}
            </List>
        </NavContainer>
    );
}

const NavContainer = styled(Box)(({ theme }) => ({
    marginTop: '3.5rem',
    position: 'fixed',
    padding: '2rem 1rem',
    width: '250px',
    height: '100vh',
    backgroundColor: '#4D9FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}));

const StyledListItem = styled(ListItem)(({ selected }) => ({
    cursor: 'pointer',
    paddingLeft: '1rem',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
}));

export default Navigation;
