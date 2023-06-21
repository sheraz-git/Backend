const express=require("express");
const userRoutes=require("../controllers/Users/userController");
const mailConfirmation=require("../controllers/email");
const protect=require("../middleware/authMiddleware");
const router = express.Router();

/// User///
router.post("/uploadImage",userRoutes.uploadImage);
router.post("/UserRegister",userRoutes.userRegister);
router.get("/getUser/:id",protect.verifyToken,userRoutes.getUser);
router.get("/getAllUser",userRoutes.getAllUser);
router.delete("/deleteUser/:id",protect.verifyToken,userRoutes.deleteUser);
router.put("/UserUpdate/:id",protect.verifyToken,userRoutes.userUpdate);

//Auth//
router.post("/UserLogin",userRoutes.userLogin);

// mail

router.get("/forUserEmail",mailConfirmation.forUserEmail);
router.get("/userEmailVerification/:id",mailConfirmation.userEmailVerification);

module.exports = router;