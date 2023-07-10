const express=require("express");
const proposalController=require("../controllers/Users/proposalController");
// const mailConfirmation=require("../controllers/email");
// const protect=require("../middleware/authMiddleware");
const router = express.Router();

/// User///
router.post("/addProposal",proposalController.addProposal);
// router.post("/UserRegister",userRoutes.userRegister);
// router.get("/getUser/:id",protect.verifyToken,userRoutes.getUser);
// router.get("/getAllUser",userRoutes.getAllUser);
// router.delete("/deleteUser/:id",protect.verifyToken,userRoutes.deleteUser);
// router.put("/UserUpdate/:id",protect.verifyToken,userRoutes.userUpdate);

module.exports = router;