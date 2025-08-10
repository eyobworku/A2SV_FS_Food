// src/routes/food.routes.js

const express = require("express");
const {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
} = require("../controller/foodController"); // Adjust the path if necessary

const router = express.Router();

// --- Food API Routes ---

// GET /api/foods?name=[searchTerm]&page=[pageNumber]&limit=[itemsPerPage]
router.get("/", getFoods);

// POST /api/foods
router.post("/", addFood);

// PUT /api/foods/:id
router.put("/:id", updateFood);

// DELETE /api/foods/:id
router.delete("/:id", deleteFood);

module.exports = router;
