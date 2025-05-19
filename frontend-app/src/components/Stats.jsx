import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#0d6efd', '#6610f2', '#198754', '#ffc107', '#dc3545'];

function Stats({ apartments, filters, user }) {
  if (!apartments || apartments.length === 0) return null;

  const favoriteIds = user?.favorites?.map(fav => fav?._id?.toString?.() ?? fav?.toString?.()) ?? [];
  const favorites = apartments.filter((a) =>
    favoriteIds.includes(a?._id?.toString())
  );

  if (!favorites || favorites.length === 0) {
    return (
      <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p>🔔 Vous n'avez pas encore de favoris. Ajoutez-en pour voir les statistiques.</p>
      </div>
    );
  }

  const avg = (arr, key) => {
    if (!arr.length) return 0;
    return Math.round(arr.reduce((acc, item) => acc + (item[key] || 0), 0) / arr.length);
  };

  const avgGeneral = {
    price: avg(apartments, 'price'),
    surface: avg(apartments, 'surface'),
    piece: avg(apartments, 'piece'),
    chambre: avg(apartments, 'chambre'),
  };

  const avgFavorites = {
    price: avg(favorites, 'price') || 0,
    surface: avg(favorites, 'surface') || 0,
    piece: avg(favorites, 'piece') || 0,
    chambre: avg(favorites, 'chambre') || 0,
  };

  const barData = [
    { label: 'Prix moyen (€)', general: avgGeneral.price, favorites: avgFavorites.price },
    { label: 'Surface moyenne (m²)', general: avgGeneral.surface, favorites: avgFavorites.surface },
    { label: 'Nb. pièces', general: avgGeneral.piece, favorites: avgFavorites.piece },
    { label: 'Nb. chambres', general: avgGeneral.chambre, favorites: avgFavorites.chambre },
  ];

  const cityCount = favorites.reduce((acc, apt) => {
    const ville = apt.ville || 'Inconnue';
    acc[ville] = (acc[ville] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(cityCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {barData.map((data, index) => (
        <div key={index} className="col-span-1 mt-4 bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">{data.label}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[data]}>
              <XAxis type="category" dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="general" fill="#0d6efd" name="Général" />
              <Bar dataKey="favorites" fill="#6610f2" name="Favoris" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}

      <div className="col-span-1 mt-4 bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">🏙️ Répartition des villes (Favoris)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={4}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Stats;
