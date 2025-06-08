import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AutoComplete from '../components/AutoComplete';
import { ThemeContext } from '../components/ThemeContext';

export default function EditApartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    titre: '',
    pays: '',
    ville: '',
    rue: '',
    rueNombre: '',
    postalCode: '',
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
    ges: '',
    description: ''
  });


  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [error, setError] = useState('');
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/apartments/${id}`);
        const data = res.data;

        setForm({
          titre: data.titre || '',
          pays: data.pays || '',
          ville: data.ville || '',
          rue: data.rue || '',
          rueNombre: data.rueNombre || '',
          postalCode: data.postalCode || '',
          price: data.price || '',
          surface: data.surface || '',
          piece: data.piece || '',
          chambre: data.chambre || '',
          etage: data.etage || '',
          a_cave: data.a_cave || false,
          a_box: data.a_box || false,
          chaufage: data.chaufage || '',
          charges: data.charges || '',
          taxeFonciere: data.taxeFonciere || '',
          energyClass: data.energyClass || '',
          ges: data.ges || '',
          description: data.description || ''
        });

        setExistingImages(data.images || []);
      } catch (err) {
        console.error("Erreur de récupération:", err);
        setError("Impossible de charger les données. Vérifiez la console.");
      }
    };

    fetchData();
  }, [id]);



  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (userId) {
      formData.append('auteur', userId);
    }

    newImages.forEach(file => formData.append('images', file));
    removedImages.forEach(image => {
      const filename = image.split('/').pop(); 
      formData.append('imagesToDelete', filename);
    });

    try {
      setIsZooming(true);
      await axios.put(`/apartments/${id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour.");
      setIsZooming(false);
    }
  };


  const handleRemoveExistingImage = (imagePath) => {
    setRemovedImages(prev => [...prev, imagePath]);
    setExistingImages(prev => prev.filter(img => img !== imagePath));
  };

  const themeMap = {
    light: { background: '#fefefe', text: '#000', input: '#fff', border: '#ddd' },
    dark: { background: '#222', text: '#fff', input: '#333', border: '#444' },
    bleu: { background: '#e7f1ff', text: '#000', input: '#fff', border: '#0048aa' },
    rouge: { background: '#ffe5e5', text: '#000', input: '#fff', border: '#910c1a' },
    vert: { background: '#e9f7ef', text: '#000', input: '#fff', border: '#0f4d2c' },
    jaune: { background: '#fff9e5', text: '#000', input: '#fff', border: '#a06e00' },
    rose: { background: '#ffe6f0', text: '#000', input: '#fff', border: '#8e1351' },
    violet: { background: '#f3e8ff', text: '#000', input: '#fff', border: '#3e187f' },
    orange: { background: '#fff3e0', text: '#000', input: '#fff', border: '#af4d00' },
    teal: { background: '#e0fffa', text: '#000', input: '#fff', border: '#11735c' },
  };

  const currentTheme = themeMap[theme] || themeMap.light;
  console.log("Form current state:", form);
  return (
    <div style={{
      maxWidth: '600px', margin: '3rem auto', padding: '2rem',
      backgroundColor: currentTheme.background, color: currentTheme.text,
      border: `1px solid ${currentTheme.border}`, borderRadius: '10px',
      boxShadow: isZooming ? '0 0 30px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
      transform: isZooming ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 0.5s ease'
    }}>
      <h2 style={{ textAlign: 'center' }}>Modifier l'appartement</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} encType="multipart/form-data">
        <input name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" style={inputStyle(currentTheme)} required />
        <AutoComplete form={form} setForm={setForm} theme={theme} />
        <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Code postal" style={inputStyle(currentTheme)} />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Prix (€)" style={inputStyle(currentTheme)} required />
        <input name="surface" type="number" value={form.surface} onChange={handleChange} placeholder="Surface (m²)" style={inputStyle(currentTheme)} />
        <input name="piece" type="number" value={form.piece} onChange={handleChange} placeholder="Pièces" style={inputStyle(currentTheme)} />
        <input name="chambre" type="number" value={form.chambre} onChange={handleChange} placeholder="Chambres" style={inputStyle(currentTheme)} />
        <input name="etage" value={form.etage} onChange={handleChange} placeholder="Étage" style={inputStyle(currentTheme)} />

        <label><input type="checkbox" name="a_cave" checked={form.a_cave} onChange={handleChange} /> Cave</label>
        <label><input type="checkbox" name="a_box" checked={form.a_box} onChange={handleChange} /> Box</label>

        <select name="chaufage" value={form.chaufage} onChange={handleChange} style={inputStyle(currentTheme)}>
          <option value="">-- Chauffage --</option>
          <option value="collectif gaz">Collectif gaz</option>
          <option value="individuel gaz">Individuel gaz</option>
          <option value="électrique">Électrique</option>
          <option value="autre">Autre</option>
        </select>

        <input name="charges" type="number" value={form.charges} onChange={handleChange} placeholder="Charges (€)" style={inputStyle(currentTheme)} />
        <input name="taxeFonciere" type="number" value={form.taxeFonciere} onChange={handleChange} placeholder="Taxe foncière (€)" style={inputStyle(currentTheme)} />

        <select name="energyClass" value={form.energyClass} onChange={handleChange} style={inputStyle(currentTheme)}>
          <option value="">-- Classe énergie --</option>
          {[...'ABCDEFG'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select name="ges" value={form.ges} onChange={handleChange} style={inputStyle(currentTheme)}>
          <option value="">-- GES --</option>
          {[...'ABCDEFG'].map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ ...inputStyle(currentTheme), minHeight: '100px' }} />

        {/* Images existantes */}
        {existingImages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {existingImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${img}`}
                  alt={`image-${idx}`}
                  style={{ width: '100px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img)}
                  style={{
                    position: 'absolute', top: 0, right: 0, background: 'red', color: '#fff',
                    border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter de nouvelles images */}
        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ ...buttonStyle, backgroundColor: '#198754' }}>
            ➕ Ajouter des images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setNewImages(prev => [...prev, ...files]);
            }}
            style={{ display: 'none' }}
          />
        </div>

        <button type="submit" style={buttonStyle}>💾 Mettre à jour</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
}

function inputStyle(theme) {
  return {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.input,
    color: theme.text
  };
}

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#0d6efd',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '1rem'
};
