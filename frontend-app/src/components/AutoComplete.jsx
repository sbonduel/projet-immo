import React, { useState } from 'react';

export default function Dashboard({ form, setForm, submitted, theme }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Recherche par adresse</h2>
      <AutoComplete form={form} setForm={setForm} submitted={submitted} theme={theme} />
      <ActiveFilters filters={form} />
    </div>
  );
}

function ActiveFilters({ filters }) {
  const readableFilters = [
    { key: 'pays', label: 'Pays' },
    { key: 'ville', label: 'Ville' },
    { key: 'rue', label: 'Rue' },
    { key: 'rueNombre', label: 'Numéro de rue' },
    { key: 'postalCode', label: 'Code postal' },
    { key: 'maxPrice', label: 'Prix max' },
    { key: 'minSurface', label: 'Surface min' },
    { key: 'minRooms', label: 'Pièces min' },
    { key: 'minBedrooms', label: 'Chambres min' },
    { key: 'hasCave', label: 'Cave' },
    { key: 'hasBox', label: 'Box' },
    { key: 'heating', label: 'Chauffage' },
    { key: 'energyClass', label: 'Classe énergie' },
    { key: 'ges', label: 'GES' },
    { key: 'floor', label: 'Étage' }, 
    { key: 'onlyFavorites', label: 'Favoris uniquement' },
  ];

  const formatValue = (value) => {
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    return value;
  };

  const activeFilters = readableFilters.filter(({ key }) => {
    const val = filters[key];
    return val !== undefined && val !== null && val !== '' && !(typeof val === 'boolean' && val === false);
  });

  if (activeFilters.length === 0) return null;

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', marginTop: '1rem' }}>
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Filtres actifs :</strong>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {activeFilters.map(({ key, label }) => (
          <li key={key}><strong>{label} :</strong> {formatValue(filters[key])}</li>
        ))}
      </ul>
    </div>
  );
}

function AutoComplete({ form, setForm, submitted, theme }) {
  const [suggestions, setSuggestions] = useState({
    pays: [],
    ville: [],
    rue: [],
    rueNombre: []
  });
  const [notice, setNotice] = useState('');

  const themes = {
    light:  { input: '#fff', text: '#000', border: '#ccc' },
    dark:   { input: '#333', text: '#fff', border: '#444' },
    bleu:   { input: '#fff', text: '#000', border: '#0048aa' },
    rouge:  { input: '#fff', text: '#000', border: '#910c1a' },
    vert:   { input: '#fff', text: '#000', border: '#0f4d2c' },
    jaune:  { input: '#fff', text: '#000', border: '#a06e00' },
    rose:   { input: '#fff', text: '#000', border: '#8e1351' },
    violet: { input: '#fff', text: '#000', border: '#3e187f' },
    orange: { input: '#fff', text: '#000', border: '#af4d00' },
    teal:   { input: '#fff', text: '#000', border: '#11735c' },
  };
  const currentTheme = themes[theme] || themes.light;

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: `1px solid ${currentTheme.border}`,
    backgroundColor: currentTheme.input,
    color: currentTheme.text,
    marginBottom: '1rem'
  };

  const warningStyle = {
    color: '#e74c3c',
    fontSize: '0.9rem',
    marginTop: '-0.25rem',
    marginBottom: '0.5rem'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'pays') {
      fetchCountrySuggestions(value);
      setNotice(value.toLowerCase() !== 'france' ? "Les annonces ne sont disponibles que pour la France." : '');
    }

    if (name === 'ville') fetchCitySuggestions(form.pays, value);
    if (name === 'rue') fetchStreetSuggestions(form.ville, value);
    if (name === 'rueNombre') fetchStreetNumberSuggestions(form.rue, value);
  };

  const selectSuggestion = (field, value) => {
    setForm({ ...form, [field]: value });
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  const fetchCountrySuggestions = (query) => {
    if (query.length < 1) return;
    const commonCountries = [
      'France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada',
      'Maroc', 'Tunisie', 'Algérie', 'Angleterre', 'Allemagne',
      'Espagne', 'Italie', 'Portugal', 'Pays-Bas', 'Irlande',
      'Norvège', 'Suède', 'Danemark', 'Finlande', 'Autriche',
      'Pologne', 'République tchèque', 'Slovaquie', 'Hongrie', 'Grèce',
      'Turquie', 'États-Unis', 'Brésil', 'Argentine', 'Australie'
    ];
    const matches = commonCountries.filter(name =>
      name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    setSuggestions((prev) => ({ ...prev, pays: matches }));
  };

  const fetchCitySuggestions = async (pays, query) => {
    if (query.length < 2 || pays.toLowerCase() !== 'france') {
      return setSuggestions((prev) => ({ ...prev, ville: [] }));
    }
    const res = await fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom&boost=population&limit=5`);
    const data = await res.json();
    setSuggestions((prev) => ({ ...prev, ville: data.map(c => c.nom) }));
  };

  const fetchStreetSuggestions = async (ville, query) => {
    if (query.length < 2 || !ville || form.pays.toLowerCase() !== 'france') {
      return setSuggestions((prev) => ({ ...prev, rue: [] }));
    }

    const q = `${query} ${ville}`;
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`);
    const data = await res.json();

    if (!data.features) return setSuggestions((prev) => ({ ...prev, rue: [] }));

    const streets = data.features
      .map(f => f.properties.name)
      .filter((v, i, a) => v && a.indexOf(v) === i);

    setSuggestions((prev) => ({ ...prev, rue: streets }));
  };

  const fetchStreetNumberSuggestions = async (rue, query) => {
    if (query.length < 1 || !rue) return;
    const pattern = /^[0-9]{1,4}$/;
    if (!pattern.test(query)) return;
    const number = parseInt(query);
    const numbers = Array.from({ length: 5 }, (_, i) => (number + i).toString());
    setSuggestions((prev) => ({ ...prev, rueNombre: numbers }));
  };

  const renderSuggestions = (field) => {
    return suggestions[field].length > 0 && (
      <ul style={{
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        width: '100%',
        zIndex: 10,
        listStyle: 'none',
        padding: 0,
        margin: 0,
        maxHeight: '150px',
        overflowY: 'auto',
      }}>
        {suggestions[field].map((item, idx) => (
          <li key={idx} style={{ padding: '0.6rem', cursor: 'pointer', borderBottom: '1px solid #eee', backgroundColor: '#fff', color: '#000' }} onClick={() => selectSuggestion(field, item)}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {submitted && !form.pays && <p style={warningStyle}>* Ce champ est obligatoire</p>}
      <div style={{ position: 'relative' }}>
        <input
          name="pays"
          value={form.pays || ''}
          onChange={handleChange}
          placeholder="Pays"
          style={inputStyle}
          autoComplete="off"
        />
        {renderSuggestions('pays')}
      </div>

      {notice && (
        <p style={{ color: 'orange', fontSize: '0.95rem', marginBottom: '1rem' }}>
          ⚠️ {notice}
        </p>
      )}

      {submitted && !form.ville && <p style={warningStyle}>* Ce champ est obligatoire</p>}
      <div style={{ position: 'relative' }}>
        <input
          name="ville"
          value={form.ville || ''}
          onChange={handleChange}
          placeholder="Ville"
          style={inputStyle}
          autoComplete="off"
        />
        {renderSuggestions('ville')}
      </div>

      {submitted && !form.rue && <p style={warningStyle}>* Ce champ est obligatoire</p>}
      <div style={{ position: 'relative' }}>
        <input
          name="rue"
          value={form.rue || ''}
          onChange={handleChange}
          placeholder="Rue"
          style={inputStyle}
          autoComplete="off"
        />
        {renderSuggestions('rue')}
      </div>

      {submitted && !form.rueNombre && <p style={warningStyle}>* Ce champ est obligatoire</p>}
      <div style={{ position: 'relative' }}>
        <input
          name="rueNombre"
          value={form.rueNombre || ''}
          onChange={handleChange}
          placeholder="Numéro de rue"
          style={inputStyle}
          autoComplete="off"
        />
        {renderSuggestions('rueNombre')}
      </div>
    </>
  );
}
