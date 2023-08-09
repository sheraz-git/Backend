const express = require("express");
const favorite = require("../controllers/Favorite/addToFavorite");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

/// favorite ///
router.post("/favoriteAdded", favorite.favoriteAdded);
router.get("/getAllFavorite/:id", favorite.getAllFavorite);
router.delete("/deleteFavorites/:id", favorite.deleteFavorites);

module.exports = router;
