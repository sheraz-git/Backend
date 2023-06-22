const contact=require("../models/contactUs");
const { forContactUs } = require("./email");
exports.contactUs = async (req, res) => {
    try {
      const { name, email, subject, phone_no,description} = req.body;
      const newContact = new contact({
        name,
        email,
        subject,
        phone_no,
        description
      });
      // Save the seller to the database
      await newContact.save();
      await forContactUs( name, email, subject, phone_no,description);
      return res.status(201).json({
         message: "Message Send",
        data: newContact,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Server error",
      });
    }
  };