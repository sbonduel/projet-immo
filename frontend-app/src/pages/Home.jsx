import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import Stats from '../components/Stats';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from '../api/axios';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [center, setCenter] = useState([48.8566, 2.3522]); // Paris
  const [apartments, setApartments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [filters, setFilters] = useState({});
  const [favoriteApartments, setFavoriteApartments] = useState([]);

  // Fonction pour calculer les statistiques des favoris
  const favoriteStats = (favorites) => {
    if (!favorites || favorites.length === 0) return null;

    const avgPrice = Math.round(
      favorites.reduce((acc, apt) => acc + apt.price, 0) / favorites.length
    );
    const avgSurface = Math.round(
      favorites.reduce((acc, apt) => acc + apt.surface, 0) / favorites.length
    );
    const cities = favorites.map((apt) => apt.ville);
    const topville =
      cities
        .sort(
          (a, b) =>
            cities.filter((v) => v === b).length - cities.filter((v) => v === a).length
        )[0] || 'N/A';

    return {
      count: favorites.length,
      avgPrice,
      avgSurface,
      topville,
    };
  };

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await axios.get('/apartments/all');
        const valid = res.data.filter(
          (apt) =>
            apt.location &&
            typeof apt.location.lat === 'number' &&
            typeof apt.location.lng === 'number'
        );
        setApartments(valid);
        if (valid.length > 0) {
          setCenter([valid[0].location.lat, valid[0].location.lng]);
        }
      } catch (err) {
        console.error("Erreur chargement appartements :", err);
      }
    };

    if (user) fetchApartments();

    const stored = JSON.parse(localStorage.getItem('siteComments') || '[]');
    setComments(stored);
  }, [user]);

  useEffect(() => {
    // Recalcule les favoris chaque fois que les appartements ou le user changent
    if (apartments.length > 0 && user) {
      const favoriteIds = user?.favorites?.map(fav => fav?._id?.toString?.()) ?? [];
      const favorites = apartments.filter((a) =>
        favoriteIds.includes(a?._id?.toString())
      );
      setFavoriteApartments(favorites);
      localStorage.setItem('favorites', JSON.stringify(favorites)); // Optionnel : pour conserver les favoris dans le localStorage
    }
  }, [apartments, user]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      user: user?.email || 'Anonyme',
      message: newComment,
      date: new Date().toLocaleString()
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem('siteComments', JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '2rem' }}>🏠 Bienvenue sur <strong>ImmoApp</strong></h1>
      <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>
        Plateforme de gestion et visualisation d'annonces immobilières.
      </p>

      {user ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <p>✅ Connecté en tant que <strong>{user.email}</strong></p>
            <p>Si jamais il y a un problème, pour actualiser les statistiques de la page d'accueil, déconnecte-toi puis reconnecte-toi.</p>
          </div>

          {/* Statistiques des favoris */}
          <Stats apartments={apartments} filters={filters} user={user} favorites={favoriteApartments} />

          <div style={{ height: '450px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd' }}>
            <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {apartments.map((apt) => (
                <Marker key={apt._id} position={[apt.location.lat, apt.location.lng]}>
                  <Popup minWidth={250}>
                    {apt.images?.length > 0 && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${apt.images[0]}`}
                        alt="apartment preview"
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '0.5rem'
                        }}
                      />
                    )}
                    <strong>{apt.titre}</strong><br />
                    {apt.rueNombre} {apt.rue}, {apt.ville}<br />
                    {apt.pays}<br />
                    <strong>{apt.price} €</strong><br />
                    <button
                      onClick={() => window.location.href = `/apartment/${apt._id}`}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.4rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Voir l'annonce
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      ) : (
        <p>🔒 Veuillez vous connecter pour afficher la carte et vos favoris.</p>
      )}

      <h2 style={{ marginTop: '3rem' }}>💬 Avis & Commentaires</h2>

      {user ? (
        <div style={{ marginTop: '1rem' }}>
          <textarea
            rows={3}
            placeholder="Laissez votre avis..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={handleAddComment}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Publier ✍️
          </button>
        </div>
      ) : (
        <p>🛑 Connectez-vous pour laisser un commentaire.</p>
      )}

      <div style={{ marginTop: '1rem' }}>
        {comments.length === 0 && <p>Aucun commentaire pour le moment.</p>}
        {comments.map((c, idx) => (
          <div key={idx} style={{
            backgroundColor: '#f1f1f1',
            borderRadius: '8px',
            padding: '0.8rem',
            marginBottom: '0.6rem'
          }}>
            <strong>{c.user}</strong> <em style={{ color: '#777' }}>({c.date})</em>
            <p style={{ marginTop: '0.3rem' }}>{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
