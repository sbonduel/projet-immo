import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ThemeContext } from '../components/ThemeContext';

const GRADES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const ENERGY_COLORS = {
  A: '#00E676', B: '#66BB6A', C: '#FFEB3B',
  D: '#FFB74D', E: '#FF8A65', F: '#F44336', G: '#D32F2F',
};

const themes = {
  light:  { background: '#fefefe', text: '#000', input: '#fff', border: '#ddd' },
  dark:   { background: '#222', text: '#fff', input: '#333', border: '#444' },
  bleu:   { background: '#e7f1ff', text: '#000', input: '#fff', border: '#0048aa' },
  rouge:  { background: '#ffe5e5', text: '#000', input: '#fff', border: '#910c1a' },
  vert:   { background: '#e9f7ef', text: '#000', input: '#fff', border: '#0f4d2c' },
  jaune:  { background: '#fff9e5', text: '#000', input: '#fff', border: '#a06e00' },
  rose:   { background: '#ffe6f0', text: '#000', input: '#fff', border: '#8e1351' },
  violet: { background: '#f3e8ff', text: '#000', input: '#fff', border: '#3e187f' },
  orange: { background: '#fff3e0', text: '#000', input: '#fff', border: '#af4d00' },
  teal:   { background: '#e0fffa', text: '#000', input: '#fff', border: '#11735c' },
};

const generateGradient = (start, end, steps = 7) => {
  const hexToRgb = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
  const rgbToHex = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
  const startRGB = hexToRgb(start), endRGB = hexToRgb(end);
  return Array.from({ length: steps }, (_, i) =>
    rgbToHex(startRGB.map((start, idx) =>
      Math.round(start + (endRGB[idx] - start) * (i / (steps - 1)))
    ))
  );
};

const EnergyScale = ({ selected, theme }) => (
  <div style={{ margin: '1.5rem 0' }}>
    <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>Classe énergie : {selected}</p>
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {GRADES.map(g => (
        <div key={g}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0.4rem 0',
            borderRadius: '8px',
            backgroundColor: ENERGY_COLORS[g],
            color: theme === 'dark' ? '#000' : '#fff',
            fontWeight: g === selected ? 'bold' : 'normal',
            fontSize: g === selected ? '1.5rem' : '1rem',
            boxShadow: g === selected ? '0 0 10px white' : 'none',
            transform: g === selected ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          {g}
        </div>
      ))}
    </div>
  </div>
);

const GESScale = ({ selected, theme }) => {
  const gradient = generateGradient('#7E57C2', '#57C27E');
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>GES : {selected}</p>
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {GRADES.map((g, idx) => (
          <div key={g}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.4rem 0',
              borderRadius: '8px',
              backgroundColor: gradient[idx],
              color: theme === 'dark' ? '#000' : '#fff',
              fontWeight: g === selected ? 'bold' : 'normal',
              fontSize: g === selected ? '1.5rem' : '1rem',
              boxShadow: g === selected ? '0 0 10px white' : 'none',
              transform: g === selected ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  );
};

function extractPointsOfInterest(description) {
  const lines = description.split('\n').map(line => line.trim());
  const keywords = ['Mairie', 'Stade', 'Carrefour', 'Gare', 'Métro', 'Université', 'Parc'];
  return lines.filter(line =>
    keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase())) &&
    line.length < 80
  );
}

export default function ApartmentDetails() {
  const { theme } = useContext(ThemeContext); // ✅ Correctement placé ici
  const currentTheme = themes[theme] || themes.light;
  const { id } = useParams();
  const navigate = useNavigate();
  const [apt, setApt] = useState(null);
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    axios.get(`/apartments/public/${id}`)
      .then(res => {
        const data = res.data;
        data.pointsOfInterest = extractPointsOfInterest(data.description || '');
        setApt(data);
      })
      .catch(() => setError("Erreur lors du chargement."));
  }, [id]);

  const handleBack = () => {
    setIsLeaving(true);
    setTimeout(() => navigate(-1), 500);
  };

  if (error) return <p>{error}</p>;
  if (!apt) return <p>Chargement...</p>;

  const infoLine = (emoji, label, value) => value && (
    <p><strong>{emoji} {label} :</strong> {value}</p>
  );

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '20px',
      backgroundColor: currentTheme.background,
      color: currentTheme.text,
      boxShadow: '0 0 1em rgba(0,0,0,0.2)',
      backdropFilter: 'blur(4px)',
      transform: isLeaving ? 'scale(0.9)' : 'scale(1)',
      opacity: isLeaving ? 0 : 1,
      transition: 'all 0.5s ease-in-out'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{apt.title}</h2>

        {apt.images?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {/* Image principale */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${apt.images[activeImage]}`}
                alt="image principale"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
            </div>

            {/* Miniatures cliquables */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              {apt.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${img}`}
                  alt={`thumb-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: activeImage === idx ? '2px solid #007bff' : '1px solid #ccc',
                    boxShadow: activeImage === idx ? '0 0 5px #007bff' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        )}


      {infoLine('📍', 'Adresse', `${apt.streetNumber ?? ''} ${apt.street}, ${apt.city}, ${apt.country}`)}
      {infoLine('💰', 'Prix', apt.price?.toLocaleString() + ' €')}
      {infoLine('📐', 'Surface', apt.surface ? `${apt.surface} m²` : null)}
      {infoLine('🛏️', 'Pièces', apt.rooms)}
      {infoLine('🛋️', 'Chambres', apt.bedrooms)}
      {infoLine('🧭', 'Étage', apt.floor)}
      {infoLine('💸', 'Charges', apt.charges ? `${apt.charges} €` : null)}
      {infoLine('🏛️', 'Taxe foncière', apt.taxeFonciere ? `${apt.taxeFonciere} €` : null)}
      {apt.owner?.email && apt.owner.email !== 'robotscrapeur@gmail.com' && infoLine('👤', 'Propriétaire', apt.owner.email)}

      <p style={{ marginTop: '1rem' }}><strong>📝 Description :</strong></p>
      <p style={{ whiteSpace: 'pre-line' }}>{apt.description}</p>

      {apt.pointsOfInterest?.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>📌 Lieux d'intérêt :</h3>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
            {apt.pointsOfInterest.map((poi, i) => (
              <li key={i}>📍 {poi}</li>
            ))}
          </ul>
        </div>
      )}

      {apt.energyClass && (
        <EnergyScale selected={apt.energyClass} theme={theme} />
      )}

      {apt.ges && (
        <GESScale selected={apt.ges} theme={theme} />
      )}

      <button
        onClick={handleBack}
        style={{
          marginTop: '2rem',
          padding: '0.6rem 1.5rem',
          borderRadius: '30px',
          backgroundColor: theme === 'dark' ? '#444' : '#eee',
          color: theme === 'dark' ? '#fff' : '#000',
          border: '1px solid rgba(0,0,0,0.2)',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease'
        }}
      >
        ⬅ Retour
      </button>
    </div>
  );
}
