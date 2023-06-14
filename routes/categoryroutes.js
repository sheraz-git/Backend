const express=require("express");
const seeder=require("../controllers/Seeder/categoryseeder");
const job=require("../controllers/Users/Job");
const portfolio=require("../controllers/Users/addPortfolio");
const protect=require("../middleware/authMiddleware");

const router = express.Router();


router.get("/categorySeeder",seeder.categorySeeder);

// Job routes
router.post("/PostAJob",protect.verifyToken,job.PostAJob);
router.get("/getAJob/:id",job.getAJob);
router.get("/getAJobByID/:id",job.getAJobByID);
router.delete("/deleteAJob/:id",protect.verifyToken,job.deleteAJob);
 router.put("/updateAJob/:id",protect.verifyToken,job.updateAJob);


// Portfolio Routes
router.post("/AddPortfolio",protect.verifyToken,portfolio.AddPortfolio);
router.get("/getPortfolio/:id",protect.verifyToken,portfolio.getPortfolio);
router.delete("/deletePortfolio/:id",protect.verifyToken,portfolio.deletePortfolio);
router.put("/updatePortfolio/:id",protect.verifyToken,portfolio.updatePortfolio);

module.exports = router;

