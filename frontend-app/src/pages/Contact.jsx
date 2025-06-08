// src/pages/Contact.jsx
import React, { useState } from 'react';
import axios from '../api/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi en cours...');
    try {
      await axios.post('/contact', form);
      setStatus('✅ Message envoyé avec succès !');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus("❌ Une erreur est survenue.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Nous contacter</h2>
      <p><strong>Projet :</strong> Prête-moi ton App - plateforme de gestion et publication d’annonces immobilières.</p>
      <p><strong>Développeur :</strong> Simon Bonduelle – étudiant en 3e année, dans le cardre de mes cours je suis content de vous presentez ce project.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <input type="text" name="name" placeholder="Votre nom" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Votre email" value={form.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Votre message" value={form.message} onChange={handleChange} required />
        <button type="submit">📩 Envoyer</button>
      </form>

      {status && <p style={{ marginTop: '1rem', color: status.includes('✅') ? 'green' : 'red' }}>{status}</p>}
    </div>
  );
}
