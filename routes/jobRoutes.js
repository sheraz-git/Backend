const express=require("express");
const job=require("../controllers/Users/Job");
const protect=require("../middleware/authMiddleware");
const jobLevels=require("../controllers/Seeder/jobLevelSeeder");

const router = express.Router();

// Job routes
router.post("/PostAJob",protect.verifyToken,job.createJob);
router.get("/getAJob/:id",job.getAJob);
router.get("/getAJobByID/:id",job.getAJobByID);
router.delete("/deleteAJob/:id",protect.verifyToken,job.deleteAJob);
router.put("/updateAJob/:id",protect.verifyToken,job.updateAJob);

// /levels
router.get("/jobLevelSeeder",jobLevels.jobLevelSeeder);



module.exports = router;

