import React from "react";

interface Props {
  name: string;
  location: string;
  price: number;
}

const ApartmentCard: React.FC<Props> = ({ name, location, price }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", width: "300px" }}>
      <img
        src="https://source.unsplash.com/300x200/?apartment"
        alt="apartment"
        style={{ width: "100%", borderRadius: "4px", marginBottom: "0.5rem" }}
      />
      <h3>{name}</h3>
      <p>{location}</p>
      <strong>{price} € / mois</strong>
    </div>
  );
};

export default ApartmentCard;
