import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([{ name: "Admin", email: "admin@mail.com" }]);
});

export default router;
