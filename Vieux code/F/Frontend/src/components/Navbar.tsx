// -> Menu principal dynamique selon la connexion
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
      <div className="flex gap-4">
        <Link to="/">Accueil</Link>
        <Link to="/appartements">Appartements</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="flex gap-4 items-center">
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="fr">🇫🇷</option>
          <option value="en">🇬🇧</option>
          <option value="es">🇪🇸</option>
        </select>
        <ThemeToggle />
        {user ? (
          <button onClick={logout}>Déconnexion</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;