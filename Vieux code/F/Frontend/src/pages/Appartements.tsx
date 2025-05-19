import { useEffect, useState } from "react";
import axios from "axios";

type Apartment = {
  title: string;
  price: number;
  city: string;
  description: string;
  link: string;
};

const Appartements = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/apartments`).then(res => {
      setApartments(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Liste des appartements</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apartments.map((apt, i) => (
          <li key={i} className="border rounded p-4 shadow">
            <h2 className="text-xl font-bold">{apt.title}</h2>
            <p>{apt.city} — {apt.price}€/mois</p>
            <p>{apt.description}</p>
            <a href={apt.link} className="text-blue-500 underline" target="_blank">Voir l’annonce</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appartements;
