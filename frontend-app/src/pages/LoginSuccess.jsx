import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../components/AuthContext';

export default function LoginSuccess() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data.user);
        navigate('/dashboard');
      } catch (err) {
        console.error('Erreur récupération utilisateur Google:', err);
        navigate('/login');
      }
    };

    fetchGoogleUser();
  }, []);

  return <p style={{ padding: '2rem' }}>Connexion avec Google... Veuillez patienter.</p>;
}
