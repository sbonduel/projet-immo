import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../components/AuthContext";
import { ThemeContext } from "../components/ThemeContext";
import axios from 'axios';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const themes = {
    light:  { navbar: '#f0f0f0', page: '#ffffff', text: '#000000', strong: '#333333', darkMode: false },
    dark:   { navbar: '#333333', page: '#111111', text: '#ffffff', strong: '#ffffff', darkMode: true },
    bleu:   { navbar: '#0d6efd', page: '#e7f1ff', text: '#000000', strong: '#0048aa', darkMode: false },
    rouge:  { navbar: '#dc3545', page: '#ffe5e5', text: '#000000', strong: '#910c1a', darkMode: false },
    vert:   { navbar: '#198754', page: '#e9f7ef', text: '#000000', strong: '#0f4d2c', darkMode: false },
    jaune:  { navbar: '#ffc107', page: '#fff9e5', text: '#000000', strong: '#a06e00', darkMode: false },
    rose:   { navbar: '#d63384', page: '#ffe6f0', text: '#000000', strong: '#8e1351', darkMode: false },
    violet: { navbar: '#6f42c1', page: '#f3e8ff', text: '#000000', strong: '#3e187f', darkMode: false },
    orange: { navbar: '#fd7e14', page: '#fff3e0', text: '#000000', strong: '#af4d00', darkMode: false },
    teal:   { navbar: '#20c997', page: '#e0fffa', text: '#000000', strong: '#11735c', darkMode: false },
  };

  const currentTheme = themes[theme];

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  const baseButtonStyle = {
    margin: '0 0.4rem',
    padding: '0.4rem 1rem',
    borderRadius: '30px',
    fontSize: '1rem',
    fontFamily: '"Dancing Script", cursive',
    textDecoration: 'none',
    border: `2px solid ${currentTheme.darkMode ? '#ffffffcc' : '#333'}`,
    backgroundColor: currentTheme.darkMode ? '#ffffff11' : '#ffffffcc',
    color: currentTheme.darkMode ? '#fff' : '#111',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(2px)',
    boxShadow: `inset 0 0 0.5em ${currentTheme.strong}55`,
  };

  const getHoverStyle = {
    backgroundColor: currentTheme.strong,
    color: '#fff',
    boxShadow: `0 0 12px ${currentTheme.strong}`,
  };

  return (
    <nav style={{
      height: '30px',
      zIndex: 1100,   
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: currentTheme.navbar,
      color: currentTheme.text,
      fontFamily: '"Dancing Script", cursive',
      transition: '0.3s',
      borderBottom: `2px solid ${currentTheme.strong}`
    }}>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledLink to="/" label="Accueil" style={baseButtonStyle} hoverStyle={getHoverStyle} />
        <StyledLink to="/dashboard" label="Apartements" style={baseButtonStyle} hoverStyle={getHoverStyle} />
        <StyledLink to="/cartes" label="Cartes" style={baseButtonStyle} hoverStyle={getHoverStyle} />
        <StyledLink to="/contact" label="Contact" style={baseButtonStyle} hoverStyle={getHoverStyle} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!user ? (
          <>
            <StyledLink to="/login" label="Se connecter" style={baseButtonStyle} hoverStyle={getHoverStyle} />
            <StyledLink to="/register" label="Inscription" style={baseButtonStyle} hoverStyle={getHoverStyle} />
          </>
        ) : (
          <>
            <span style={{ marginRight: '1rem' }}>Connecté : {user.email}</span>
            <StyledButton label="Se déconnecter" onClick={handleLogout} style={baseButtonStyle} hoverStyle={getHoverStyle} />
          </>
        )}

        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{
          marginLeft: '1rem',
          padding: '0.4rem',
          borderRadius: '10px',
          fontFamily: '"Dancing Script", cursive',
          backgroundColor: currentTheme.page,
          color: currentTheme.text,
          border: `1px solid ${currentTheme.strong}`,
        }}>
          {Object.keys(themes).map(name => (
            <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}

function StyledLink({ to, label, style, hoverStyle }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={hover ? { ...style, ...hoverStyle } : style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
}

function StyledButton({ onClick, label, style, hoverStyle }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      style={hover ? { ...style, ...hoverStyle } : style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </button>
  );
}
