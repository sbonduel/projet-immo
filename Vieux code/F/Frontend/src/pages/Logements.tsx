import React, { useEffect, useState } from "react";
import axios from "axios";
import ApartmentCard from "../components/ApartmentCard";

interface Apartment {
  _id: string;
  title: string;
  price: number;
  city: string;
  description: string;
}

const Logements: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/apartments").then((res) => {
      setApartments(res.data);
    });
  }, []);

  const filtered = apartments.filter((a) =>
    a.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📋 Liste des logements</h1>
      <input
        type="text"
        placeholder="Rechercher par ville..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filtered.map((apt) => (
          <ApartmentCard
            key={apt._id}
            name={apt.title}
            location={apt.city}
            price={apt.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Logements;
