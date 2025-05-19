// geocode.js
const axios = require('axios');

async function getCoordinatesFromAddress({ pays, ville, rue, rueNombre }) {
  const address = `${rueNombre} ${rue}, ${ville}, ${pays}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'app-immo' }
  });

  if (res.data.length > 0) {
    return {
      lat: parseFloat(res.data[0].lat),
      lng: parseFloat(res.data[0].lon)
    };
  }

  throw new Error('Adresse introuvable');
}

async function getAddressFromCoordinates(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'app-immo' }
  });

  if (res.data && res.data.address) {
    return {
      rue: res.data.address.road || '',
      rueNombre: res.data.address.house_number || '',
      ville: res.data.address.city || res.data.address.town || res.data.address.village || '',
      pays: res.data.address.country || '' 
    };
  }

  throw new Error('Adresse inverse introuvable');
}

module.exports = {
  getCoordinatesFromAddress,
  getAddressFromCoordinates
};
