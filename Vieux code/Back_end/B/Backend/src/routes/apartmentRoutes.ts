import express from "express";
import Apartment from "../models/Apartment";
import scrapeApartments from "../scraping/scraper";

const router = express.Router();

router.get("/", async (req, res) => {
  const apartments = await Apartment.find();
  res.json(apartments);
});

router.post("/scrape", async (req, res) => {
  const newApartments = await scrapeApartments();
  res.json(newApartments);
});

export default router;
