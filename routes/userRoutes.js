const express=require("express");
const userRoutes=require("../controllers/Users/userController");
const mailConfirmation=require("../controllers/email");
const protect=require("../middleware/authMiddleware");
const roleroutes=require("../controllers/Seeder/roleSeeder");
const seeder=require("../controllers/Seeder/countryseeder")
const router = express.Router();

/// User///
router.post("/uploadImage",userRoutes.uploadImage);
router.post("/UserRegister",userRoutes.UserRegister);
router.get("/getUser/:id",protect.verifyToken,userRoutes.getUser);
router.get("/getAllUser",userRoutes.getAllUser);
router.delete("/deleteUser/:id",protect.verifyToken,userRoutes.deleteUser);
router.put("/UserUpdate/:id",protect.verifyToken,userRoutes.UserUpdate);

//Auth//
router.post("/UserLogin",userRoutes.UserLogin);

// mail

router.get("/forSeller",protect.verifyToken,mailConfirmation.forSeller);

//role

router.get("/roleSeeder",roleroutes.roleSeeder);


/// country seeder//
router.get("/countrySeeder",seeder.countrySeeder);

module.exports = router;