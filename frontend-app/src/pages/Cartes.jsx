import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import 'leaflet/dist/leaflet.css';

// Composant pour centrer dynamiquement la carte
function ChangeMapCenter({ center }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

export default function Cartes() {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const defaultCenter = [48.8566, 2.3522]; // Paris
  const [center, setCenter] = useState(defaultCenter);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await axios.get('/apartments');
        const valid = res.data.filter(
          (apt) =>
            apt.location &&
            typeof apt.location.lat === 'number' &&
            typeof apt.location.lng === 'number'
        );
        setApartments(valid);
        setFilteredApartments(valid);

        if (valid.length > 0 && center[0] === defaultCenter[0] && center[1] === defaultCenter[1]) {
          setCenter([valid[0].location.lat, valid[0].location.lng]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des appartements :", err);
      }
    };

    fetchApartments();
  }, []);

  // Filtrage par titre ou ville
  useEffect(() => {
    const filtered = apartments.filter((apt) =>
      apt.titre.toLowerCase().includes(searchText.toLowerCase()) ||
      apt.ville.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredApartments(filtered);
  }, [searchText, apartments]);

  // Recherche géographique
  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (err) {
      console.error("Erreur lors de la géolocalisation :", err);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* Barre de recherche */}
      <div style={{ padding: '1rem' }}>
        <h2>Tous les Appartements</h2>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '1rem'
        }}>
          <input
            type="text"
            placeholder="🔍 Rechercher par titre ou ville"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
          <input
            type="text"
            placeholder="📍 Rechercher près d’une adresse"
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
          <button
            onClick={handleAddressSearch}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔎 Chercher
          </button>
        </div>
      </div>

      {/* Carte */}
      <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
          <ChangeMapCenter center={center} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredApartments.map((apt) => (
            <Marker key={apt._id} position={[apt.location.lat, apt.location.lng]}>
              <Popup minWidth={250}>
                {apt.images?.length > 0 && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${apt.images[0]}`}
                    alt="preview"
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
                  onClick={() => navigate(`/apartment/${apt._id}`)}
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
    </div>
  );
}
