import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password }, { withCredentials: true });
      setUser(res.data.user);
      navigate('/');
    } catch {
      setError('Identifiants invalides.');
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Connexion</h2>
        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Se connecter</button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </form>

        <hr style={{ margin: '1.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a href="http://localhost:5000/api/auth/google" style={{ textDecoration: 'none' }}>
            <button style={{ ...buttonStyle, backgroundColor: '#db4437' }}>Connexion avec Google</button>
          </a>
        </div>
      </div>
    </div>
  );
}

// 🌐 CENTRAGE DE LA PAGE
const wrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f0f2f5',
};

const containerStyle = {
  width: '100%',
  maxWidth: '450px',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#333',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9',
};

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#0d6efd',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};
