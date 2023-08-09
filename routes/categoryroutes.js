const express = require("express");
const seeder = require("../controllers/Seeder/categoryseeder");
const portfolio = require("../controllers/Users/addPortfolio");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/categorySeeder", seeder.categorySeeder);

// Portfolio Routes
router.post("/AddPortfolio", portfolio.AddPortfolio);
router.get("/getPortfolio/:id", portfolio.getPortfolio);
router.delete(
  "/deletePortfolio/:id",

  portfolio.deletePortfolio
);
router.put(
  "/updatePortfolio/:id",

  portfolio.updatePortfolio
);

module.exports = router;
