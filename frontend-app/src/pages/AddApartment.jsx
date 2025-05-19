// AddApartment.jsx
import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../components/AuthContext';
import AutoComplete from '../components/AutoComplete';
import { ThemeContext } from '../components/ThemeContext';

export default function AddApartment() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isZooming, setIsZooming] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const themeMap = {
    bleu:   { background: '#e7f1ff', text: '#000', input: '#fff', border: '#0048aa', shadow: '0 2px 10px rgba(13, 110, 253, 0.2)' },
    rouge:  { background: '#ffe5e5', text: '#000', input: '#fff', border: '#b02a37', shadow: '0 2px 10px rgba(220, 53, 69, 0.2)' },
    vert:   { background: '#e9f7ef', text: '#000', input: '#fff', border: '#146c43', shadow: '0 2px 10px rgba(25, 135, 84, 0.2)' },
    jaune:  { background: '#fff9e5', text: '#000', input: '#fff', border: '#ffca2c', shadow: '0 2px 10px rgba(255, 193, 7, 0.2)' },
    rose:   { background: '#ffe6f0', text: '#000', input: '#fff', border: '#d63384', shadow: '0 2px 10px rgba(214, 51, 132, 0.2)' },
    violet: { background: '#f3e8ff', text: '#000', input: '#fff', border: '#6f42c1', shadow: '0 2px 10px rgba(111, 66, 193, 0.2)' },
    orange: { background: '#fff3e0', text: '#000', input: '#fff', border: '#fd7e14', shadow: '0 2px 10px rgba(253, 126, 20, 0.2)' },
    teal:   { background: '#e0fffa', text: '#000', input: '#fff', border: '#20c997', shadow: '0 2px 10px rgba(32, 201, 151, 0.2)' },
    light:  { background: '#f8f9fa', text: '#000', input: '#fff', border: '#ccc', shadow: '0 2px 10px rgba(0,0,0,0.1)' },
    dark:   { background: '#1e1e1e', text: '#fff', input: '#333', border: '#444', shadow: '0 2px 10px rgba(255,255,255,0.05)' }
  };

  const currentTheme = themeMap[theme] || themeMap.vert;

  const inputStyle = {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: `1px solid ${currentTheme.border}`,
    backgroundColor: currentTheme.input,
    color: currentTheme.text
  };

  const warningStyle = {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '-0.5rem'
  };

  const buttonStyle = {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: currentTheme.border,
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    border: `1px solid ${currentTheme.border}`,
    borderRadius: '10px',
    boxShadow: isZooming ? '0 0 30px rgba(0,0,0,0.4)' : currentTheme.shadow,
    transform: isZooming ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.5s ease'
  };

  const [form, setForm] = useState({
    titre: '',
    description: '',
    pays: '',
    ville: '',
    postalCode: '',
    rue: '',
    rueNombre: '',
    price: '',
    surface: '',
    piece: '',
    chambre: '',
    etage: '',
    a_cave: false,
    a_box: false,
    chaufage: '',
    charges: '',
    taxeFonciere: '',
    energyClass: '',
    ges: ''
  });

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const requiredFields = ['titre', 'pays', 'ville', 'rue', 'rueNombre', 'price'];
    const missing = requiredFields.some(field => !form[field]);
    if (missing) return;

    const formData = new FormData();
    const cleanForm = { ...form };

    ['chaufage', 'energyClass', 'ges'].forEach(field => {
      if (!cleanForm[field]) delete cleanForm[field];
    });

    Object.entries(cleanForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('sourceUrl', `manuel-${Date.now()}-${user._id}`);
    formData.append('auteur', user._id);

    images.forEach(file => formData.append('images', file));

    try {
      setIsZooming(true);
      setTimeout(async () => {
        await axios.post('/apartments', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      console.error('Erreur lors de l’ajout :', err);
      setError("Erreur lors de l'ajout de l'appartement.");
      setIsZooming(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ajouter un appartement</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} encType="multipart/form-data">
        {submitted && !form.titre && <p style={warningStyle}>* Ce champ est obligatoire</p>}
        <input name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} style={inputStyle} />

        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ ...buttonStyle, backgroundColor: '#198754' }}>
            ➕ Ajouter des images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(prev => [...prev, ...Array.from(e.target.files)])}
            style={{ display: 'none' }}
          />
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {images.map((file, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`aperçu-${idx}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute', top: 0, right: 0, background: 'red', color: 'white',
                      border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AutoComplete form={form} setForm={setForm} submitted={submitted} theme={theme} />
        <input name="postalCode" placeholder="Code postal" value={form.postalCode} onChange={handleChange} style={inputStyle} />
        {submitted && !form.price && <p style={warningStyle}>* Ce champ est obligatoire</p>}
        <input name="price" type="number" placeholder="Prix (€)" value={form.price} onChange={handleChange} style={inputStyle} />
        <input name="surface" type="number" placeholder="Surface (m²)" value={form.surface} onChange={handleChange} style={inputStyle} />
        <input name="piece" type="number" placeholder="Nombre de pièces" value={form.piece} onChange={handleChange} style={inputStyle} />
        <input name="chambre" type="number" placeholder="Nombre de chambres" value={form.chambre} onChange={handleChange} style={inputStyle} />
        <input name="etage" placeholder="Étage" value={form.etage} onChange={handleChange} style={inputStyle} />

        <label style={{ color: currentTheme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" name="a_cave" checked={form.a_cave} onChange={handleChange} /> Cave
        </label>
        <label style={{ color: currentTheme.text, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" name="a_box" checked={form.a_box} onChange={handleChange} /> Box
        </label>

        <select name="chaufage" value={form.chaufage} onChange={handleChange} style={inputStyle}>
          <option value="">-- Mode de chauffage --</option>
          <option value="collectif gaz">Collectif gaz</option>
          <option value="individuel gaz">Individuel gaz</option>
          <option value="électrique">Électrique</option>
          <option value="autre">Autre</option>
        </select>

        <input name="charges" type="number" placeholder="Charges (€)" value={form.charges} onChange={handleChange} style={inputStyle} />
        <input name="taxeFonciere" type="number" placeholder="Taxe foncière (€)" value={form.taxeFonciere} onChange={handleChange} style={inputStyle} />

        <select name="energyClass" value={form.energyClass} onChange={handleChange} style={inputStyle}>
          <option value="">-- Classe énergie --</option>
          {[...'ABCDEFG'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select name="ges" value={form.ges} onChange={handleChange} style={inputStyle}>
          <option value="">-- GES --</option>
          {[...'ABCDEFG'].map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />

        <button type="submit" style={buttonStyle}>➕ Ajouter</button>
        {submitted && (['titre', 'pays', 'ville', 'rue', 'rueNombre', 'price'].some(field => !form[field])) && (
          <p style={{ color: 'red', textAlign: 'center' }}>Veuillez remplir tous les champs obligatoires.</p>
        )}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
}
