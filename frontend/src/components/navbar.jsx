import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
        <div style={styles.inner}>
        <h2 style={styles.logo}>CodeTeam Manager</h2>
        <button onClick={handleLogout} style={styles.button}>Cerrar sesión</button>
        </div>
    </nav>
  );

};

const styles = {
  nav: {
    width: '100%',
    padding: '1rem 0',
    backgroundColor: '#213547',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxSizing: 'border-box'
  },
  logo: {
    margin: 0
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  inner: {
    maxWidth: '1500px',
    width: '100%',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  },

};

export default NavBar;
