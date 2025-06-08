import Apartment from "../models/Apartment";

export default async function scrapeApartments() {
  const mockData = [
    {
      title: "Appartement moderne à Paris",
      price: 1200,
      city: "Paris",
      description: "Appartement lumineux avec balcon",
      link: "https://example.com/appart/paris"
    },
    {
      title: "T2 rénové à Lyon",
      price: 900,
      city: "Lyon",
      description: "Parfait pour jeune couple ou étudiant",
      link: "https://example.com/appart/lyon"
    }
  ];

  const inserted = await Apartment.insertMany(mockData);
  return inserted;
}