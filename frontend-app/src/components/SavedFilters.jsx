import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export default function SavedFilters({ onApply }) {
  const { theme } = useContext(ThemeContext);
  const [filters, setFilters] = useState({
    ville: '',
    postalCode: '',
    maxPrice: '',
    minSurface: '',
    minPiece: '',
    minChambre: '',
    a_cave: false,
    a_box: false,
    chaufage: '',
    energyClass: '',
    ges: '',
    etage: '',
    onlyFavorites: false
  });

  const [saved, setSaved] = useState([]);

  const themes = {
    light: { background: '#fefefe', text: '#000', border: '#ddd' },
    dark: { background: '#222', text: '#fff', border: '#444' },
    bleu: { background: '#e7f1ff', text: '#000', border: '#0048aa' },
    rouge: { background: '#ffe5e5', text: '#000', border: '#910c1a' },
    vert: { background: '#e9f7ef', text: '#000', border: '#0f4d2c' },
    jaune: { background: '#fff9e5', text: '#000', border: '#a06e00' },
    rose: { background: '#ffe6f0', text: '#000', border: '#8e1351' },
    violet: { background: '#f3e8ff', text: '#000', border: '#3e187f' },
    orange: { background: '#fff3e0', text: '#000', border: '#af4d00' },
    teal: { background: '#e0fffa', text: '#000', border: '#11735c' },
  };

  const currentTheme = themes[theme] || themes.light;

  const sidebarStyle = {
    padding: '1rem',
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    borderRight: `2px solid ${currentTheme.border}`,
    width: '250px',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    overflowY: 'auto'
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '0.75rem',
    padding: '0.5rem',
    border: `1px solid ${currentTheme.border}`,
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#000'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#198754',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    marginBottom: '1rem',
    cursor: 'pointer'
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedFilters') || '[]');
    setSaved(stored);
  }, []);

  const saveFilter = () => {
    const newSaved = [...saved, filters];
    setSaved(newSaved);
    localStorage.setItem('savedFilters', JSON.stringify(newSaved));
  };

  const applyFilter = (f) => onApply(f);

  const deleteFilter = (index) => {
    const updated = saved.filter((_, i) => i !== index);
    setSaved(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ paddingTop: '50px' }}></div>
      <h3>🔎 Filtres personnalisés</h3>

      <input placeholder="Ville" value={filters.ville} onChange={e => setFilters({ ...filters, ville: e.target.value })} style={inputStyle} />
      <input placeholder="Code postal" value={filters.postalCode} onChange={e => setFilters({ ...filters, postalCode: e.target.value })} style={inputStyle} />
      <input placeholder="Prix max (€)" type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} style={inputStyle} />
      <input placeholder="Surface min (m²)" type="number" value={filters.minSurface} onChange={e => setFilters({ ...filters, minSurface: e.target.value })} style={inputStyle} />
      <input placeholder="Pièces min" type="number" value={filters.minPiece} onChange={e => setFilters({ ...filters, minPiece: e.target.value })} style={inputStyle} />
      <input placeholder="Chambres min" type="number" value={filters.minChambre} onChange={e => setFilters({ ...filters, minChambre: e.target.value })} style={inputStyle} />
      <input placeholder="Étage" value={filters.etage} onChange={e => setFilters({ ...filters, etage: e.target.value })} style={inputStyle} />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" checked={filters.a_cave} onChange={e => setFilters({ ...filters, a_cave: e.target.checked })} /> Cave
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" checked={filters.a_box} onChange={e => setFilters({ ...filters, a_box: e.target.checked })} /> Box
      </label>

      <select value={filters.chaufage} onChange={e => setFilters({ ...filters, chaufage: e.target.value })} style={inputStyle}>
        <option value="">-- Chauffage --</option>
        <option value="collectif gaz">Collectif gaz</option>
        <option value="individuel gaz">Individuel gaz</option>
        <option value="électrique">Électrique</option>
        <option value="autre">Autre</option>
      </select>

      <select value={filters.energyClass} onChange={e => setFilters({ ...filters, energyClass: e.target.value })} style={inputStyle}>
        <option value="">-- Classe énergie --</option>
        {[...'ABCDEFG'].map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.ges} onChange={e => setFilters({ ...filters, ges: e.target.value })} style={inputStyle}>
        <option value="">-- GES --</option>
        {[...'ABCDEFG'].map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input type="checkbox" checked={filters.onlyFavorites} onChange={e => setFilters({ ...filters, onlyFavorites: e.target.checked })} /> Uniquement mes favoris ❤️
      </label>

      <button onClick={saveFilter} style={buttonStyle}>💾 Enregistrer</button>

      <h4>Mes filtres :</h4>
      {saved.length === 0 && <p style={{ fontStyle: 'italic' }}>Aucun filtre enregistré</p>}
      {saved.map((f, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', borderBottom: `1px solid ${currentTheme.border}`, paddingBottom: '0.5rem' }}>
          <p>
            📍 {f.ville || '-'} {f.postalCode ? `(${f.postalCode})` : ''} | 💰 ≤ {f.maxPrice || '-'}€ | 📐 ≥ {f.minSurface || '-'}m² | 🚪 ≥ {f.minPiece || '-'} | 🛏️ ≥ {f.minChambre || '-'}
            {f.onlyFavorites && ' | ❤️ Favoris'}
          </p>
          <button onClick={() => applyFilter(f)} style={{ ...buttonStyle, backgroundColor: '#0d6efd' }}>🧪 Appliquer</button>
          <button onClick={() => deleteFilter(idx)} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>❌ Supprimer</button>
        </div>
      ))}
    </div>
  );
}
