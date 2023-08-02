const express=require("express");
const favorite=require("../controllers/Favorite/addToFavorite");
const protect=require("../middleware/authMiddleware")
const router = express.Router();

/// favorite ///
router.post("/favoriteAdded",protect.verifyToken,favorite.favoriteAdded);
router.get("/getAllFavorite/:id",protect.verifyToken,favorite.getAllFavorite);


module.exports = router;