const express=require("express");
const contact=require("../controllers/contactUs");
const router = express.Router();

/// contact us ///
router.post("/contactUserInfo",contact.contactUserInfo);



module.exports = router;