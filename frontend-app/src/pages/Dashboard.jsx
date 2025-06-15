import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from "../components/AuthContext";
import { ThemeContext } from "../components/ThemeContext";
import { useNavigate } from 'react-router-dom';
import SavedFilters from '../components/SavedFilters';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [apartments, setApartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [zoomedId, setZoomedId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const limit = 6;
  const isDark = theme === 'dark';

  useEffect(() => {
    if (user) {
      fetchApartments();
      fetchFavorites();
    }
  }, [user, page]);

  useEffect(() => {
    filterApartments();
  }, [filters, apartments, favorites, searchTerm, sortOption, locationSearch]);

  const fetchApartments = async () => {
    try {
      const res = await axios.get(`/apartments?limit=${limit}&skip=${(page - 1) * limit}`);
      setApartments(res.data);
    } catch (err) {
      console.error('Erreur en récupérant les appartements :', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/favorites', { withCredentials: true });
      setFavorites(res.data);
    } catch (err) {
      console.error('Erreur récupération favoris :', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`/apartments/${id}`);
      setApartments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleZoomNavigate = (path, id) => {
    setZoomedId(id);
    setTimeout(() => {
      navigate(path);
      setZoomedId(null);
    }, 600);
  };

  const toggleFavorite = async (id) => {
    try {
      const isFav = favorites.includes(id);
      if (isFav) {
        await axios.delete(`/favorites/${id}`, { withCredentials: true });
        setFavorites(prev => prev.filter(f => f !== id));
      } else {
        await axios.post(`/favorites/${id}`, {}, { withCredentials: true });
        setFavorites(prev => [...prev, id]);
      }
      // Ajoutez cette ligne pour forcer la mise à jour des favoris
      fetchFavorites(); 
    } catch (err) {
      console.error('Erreur en modifiant le favori :', err);
    }
  };


  const filterApartments = () => {
    let result = [...apartments];

    if (filters.ville) result = result.filter(a => a.ville?.toLowerCase().includes(filters.ville.toLowerCase()));
    if (filters.maxPrice) result = result.filter(a => a.price <= parseFloat(filters.maxPrice));
    if (filters.minSurface) result = result.filter(a => a.surface >= parseFloat(filters.minSurface));
    if (filters.minPiece) result = result.filter(a => a.piece >= parseInt(filters.minPiece));
    if (filters.minChambre) result = result.filter(a => a.chambre >= parseInt(filters.minChambre));
    if (filters.a_cave) result = result.filter(a => a.a_cave);
    if (filters.a_box) result = result.filter(a => a.a_box);
    if (filters.chaufage) result = result.filter(a => a.chaufage === filters.chaufage);
    if (filters.energyClass) result = result.filter(a => a.energyClass === filters.energyClass);
    if (filters.ges) result = result.filter(a => a.ges === filters.ges);
    if (filters.onlyFavorites) result = result.filter(a => favorites.includes(a._id));

    if (searchTerm) {
      result = result.filter(
        a =>  (a.titre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
              (a.ville || "").toLowerCase().includes(searchTerm.toLowerCase())

      );
    }

    if (locationSearch) {
      result = result.filter(
        a => `${a.rue} ${a.ville} ${a.pays}`.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    if (sortOption === 'priceAsc') result.sort((a, b) => a.price - b.price);
    if (sortOption === 'priceDesc') result.sort((a, b) => b.price - a.price);
    if (sortOption === 'titleAsc') result.sort((a, b) => a.titre.localeCompare(b.titre));
    if (sortOption === 'titleDesc') result.sort((a, b) => b.titre.localeCompare(a.titre));
    if (sortOption === 'dateAsc') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortOption === 'dateDesc') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFiltered(result);
  };

  const getStyles = () => {
    const themeColors = {
    light: {
      background: '#e0e0e0', // plus sombre que #f9f9f9
      text: '#111',
      border: '#bbb',
      shadow: '0 2px 5px rgba(0,0,0,0.15)',
      highlight: '0 0 24px rgba(0, 123, 255, 0.4)'
    },
    dark: {
      background: '#0d0d0d', // plus sombre que #222
      text: '#f1f1f1',
      border: '#444',
      shadow: '0 2px 5px rgba(255,255,255,0.05)',
      highlight: '0 0 24px rgba(255, 255, 255, 0.3)'
    },
    bleu: {
      background: '#003355', // très sombre et bleu
      text: '#cce6ff',
      border: '#005f99',
      shadow: '0 2px 5px rgba(0, 123, 255, 0.25)',
      highlight: '0 0 24px rgba(0, 123, 255, 0.5)'
    },
    rouge: {
      background: '#330000', // rouge foncé
      text: '#ffcccc',
      border: '#800000',
      shadow: '0 2px 5px rgba(255, 0, 0, 0.25)',
      highlight: '0 0 24px rgba(255, 0, 0, 0.5)'
    },
    vert: {
      background: '#003320', // vert foncé
      text: '#ccffe6',
      border: '#006644',
      shadow: '0 2px 5px rgba(40, 167, 69, 0.25)',
      highlight: '0 0 24px rgba(40, 167, 69, 0.5)'
    },
    jaune: {
      background: '#4d4400', // jaune très foncé
      text: '#fff5cc',
      border: '#b38f00',
      shadow: '0 2px 5px rgba(255, 193, 7, 0.25)',
      highlight: '0 0 24px rgba(255, 193, 7, 0.5)'
    },
    rose: {
      background: '#4d0026', // rose foncé
      text: '#ffd6e6',
      border: '#99004d',
      shadow: '0 2px 5px rgba(255, 105, 180, 0.25)',
      highlight: '0 0 24px rgba(255, 105, 180, 0.5)'
    },
    violet: {
      background: '#2a004d', // violet profond
      text: '#e6ccff',
      border: '#5e00b3',
      shadow: '0 2px 5px rgba(138, 43, 226, 0.25)',
      highlight: '0 0 24px rgba(138, 43, 226, 0.5)'
    },
    orange: {
      background: '#4d1a00', // orange très foncé
      text: '#ffddcc',
      border: '#b35900',
      shadow: '0 2px 5px rgba(255, 140, 0, 0.25)',
      highlight: '0 0 24px rgba(255, 140, 0, 0.5)'
    },
    teal: {
      background: '#003333', // teal profond
      text: '#ccffff',
      border: '#007777',
      shadow: '0 2px 5px rgba(0, 128, 128, 0.25)',
      highlight: '0 0 24px rgba(0, 128, 128, 0.5)'
    }
  };


    const current = themeColors[theme] || themeColors.light;

    return {
      card: {
        border: `1px solid ${current.border}`,
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: current.background,
        color: current.text,
        boxShadow: current.shadow,
        transition: 'transform 0.6s ease, box-shadow 0.6s ease',
        position: 'relative',
      },
      highlight: current.highlight,
      text: {
        fontStyle: 'italic',
        color: current.text,
      }
    };
  };


  const renderNotLoggedIn = () => (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p style={{ fontSize: '1.2rem' }}>Vous devez être connecté pour voir les appartements.</p>
      <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
        Se connecter
      </button>
    </div>
  );

  const renderApartmentCard = (apt) => {
    const styles = getStyles();
    const isOwner = user._id === apt.owner?._id || user._id === apt.owner;
    const isAdmin = user.role === 'admin';
    const showOwner = apt.owner?.email && apt.owner.email !== 'robotscrapeur@gmail.com';
    const isFavorite = favorites.includes(apt._id);

    return (
      <div
        key={apt._id}
        style={{
            ...styles.card,
            transform: zoomedId === apt._id ? 'scale(1.07)' : 'scale(1)',
            boxShadow: zoomedId === apt._id ? styles.highlight : styles.card.boxShadow,
            zIndex: zoomedId === apt._id ? 10 : 1
        }}
      >
          <button onClick={() => toggleFavorite(apt._id)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', position: 'absolute', top: '0.5rem', right: '0.5rem', cursor: 'pointer', color: isFavorite ? 'red' : '#bbb' }}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
        {apt.images && apt.images.length > 0 && (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${apt.images[0]}`}
            alt="aperçu"
            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }}
          />
        )}
        <h3>{apt.titre}</h3>

        <p><strong>📍 Adresse :</strong> {apt.rueNombre} {apt.rue}, {apt.ville}, {apt.pays}</p>
        <p><strong>💰 Prix :</strong> {apt.price} €</p>
        {showOwner && <p><strong>👤 Propriétaire :</strong> {apt.owner.email}</p>}
        <p style={styles.text}>
          {apt.description.length > 150 ? apt.description.slice(0, 150) + '...' : apt.description}
        </p>
        <button onClick={() => handleZoomNavigate(`/apartment/${apt._id}`, apt._id)} style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
          🔍 Voir l'annonce
        </button>
        {(isOwner || isAdmin) && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => handleZoomNavigate(`/edit/${apt._id}`, apt._id)} style={{ marginRight: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px' }}>
              Modifier
            </button>
            <button onClick={() => handleDelete(apt._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px' }}>
              Supprimer
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!user) return renderNotLoggedIn();

  return (
    <>
      <div style={{ padding: '0 2rem', paddingTop: '1rem', backgroundColor: getStyles().card.backgroundColor, color: getStyles().card.color }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem', marginLeft: showFilters ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          <div>
            <h2>Tous les Appartements</h2>
            {Object.keys(filters).length > 0 && (
                <p style={{ fontStyle: 'italic', color: isDark ? '#ccc' : '#666' }}>
                  Filtres actifs : 
                  {Object.entries(filters)
                    .filter(([key, value]) => value !== undefined && value !== '' && value !== false) // Filtrer les filtres vides, non définis, ou false
                    .map(([key, value]) => {
                      // Définir des labels plus compréhensibles
                      const labelMap = {
                        ville: 'Ville',
                        postalCode: 'Code postal',
                        maxPrice: 'Prix max',
                        minSurface: 'Surface min',
                        minPiece: 'Chambres min',
                        minChambre: 'Chambres à coucher min',
                        a_cave: 'Cave uniquement',
                        a_box: 'Box uniquement',
                        chaufage: 'Chauffage',
                        energyClass: 'Classe énergétique',
                        ges: 'GES',
                        etage: 'Étage',
                        onlyFavorites: 'Favoris uniquement'
                      };

                      const label = labelMap[key] || key; // Utiliser le label défini ou la clé d'origine

                      // Transformer les valeurs booléennes en icônes
                      if (typeof value === 'boolean') {
                        return `${label}: ${value ? '✅' : '❌'}`;
                      }

                      return `${label}: ${value}`; // Sinon, afficher la valeur normalement
                    })
                    .join(' | ')}
                </p>

            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1rem' }}>
              <input type="text" placeholder="🔍 Rechercher par titre ou ville" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }} />
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">Trier par</option>
                <option value="priceAsc">Prix ↑</option>
                <option value="priceDesc">Prix ↓</option>
                <option value="titleAsc">Nom A-Z</option>
                <option value="titleDesc">Nom Z-A</option>
                <option value="dateDesc">Date récente</option>
                <option value="dateAsc">Date ancienne</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowFilters(!showFilters)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              🧩 Filtres
            </button>
            <button onClick={() => navigate('/add')} style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              ➕ Ajouter un appartement
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: showFilters ? '250px' : '0', overflowX: 'hidden', transition: 'all 0.3s ease', padding: showFilters ? '1rem' : '0', backgroundColor: isDark ? '#111' : '#f1f1f1', color: isDark ? '#fff' : '#000', borderRight: '1px solid #ccc', position: 'fixed', left: 0, bottom: 0, zIndex: 1000, top: '64px' }}>
          {showFilters && <SavedFilters onApply={(newFilters) => setFilters(newFilters)} theme={theme} />}
        </div>

        <div style={{ flex: 1, padding: '2rem', marginLeft: showFilters ? '250px' : '0', transition: 'margin-left 0.3s' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Aucun appartement trouvé.</p>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {filtered.map(renderApartmentCard)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                {page > 1 && (<button onClick={() => setPage(page - 1)} style={{ marginRight: '1rem' }}>⬅ Précédent</button>)}
                {filtered.length === limit && (<button onClick={() => setPage(page + 1)}>Suivant ➡</button>)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
