const User = require("../../models/userModel");
const Country = require("../../models/country");
const cloudinary = require("cloudinary").v2;
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs");
const { forSeller } = require("../email");

cloudinary.config({
  cloud_name: "dsv28ungz",
  api_key: "775634257667667",
  api_secret: "6jMBqRlVALHfbR8udrS3fUf4m1A",
});
exports.UserRegister = async (req, res) => {
  try {
    const file1 = req.files.file;
    let result1 = await cloudinary.uploader.upload(file1.tempFilePath);
    const {first_name,last_name,email,password ,service_Title ,hourly_rate ,phone_no,service_Description} = req.body;
    // Check if the seller already exists
    let count = await Country.findOne({ country: req.body.country });
    console.log("sds",count);     

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "email already exists",
      });
    }
    
    // Access the role value from the request object
    const selectedRole = req.role;

    // Create a new seller
    const newUser = new User({
      image:result1.url,
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      role:selectedRole._id,
      country:count._id,
      phone_no,
      service_Description
    });
    // Save the seller to the database
    await newUser.save();
    await forSeller(first_name, last_name, email, password);
    return res.status(201).json({
      message: "User created and email sent successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist",
      });
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect Email and password",
      });
    }
    
    const token = jwt.sign({ userId: user._id }, "paypal", { expiresIn: '1h' });
    
    return res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          // Include any other relevant user data you want to return
        },
        token
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getAllUser = async (req, res) => {
  try {

    const user = await User.find().populate("country");    
    if (!user) {
      return res.status(200).json({
        message: "user doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "All user data",
        count:user.length,
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findOne({ _id: userid }).populate("country");    
    if (!user) {
      return res.status(200).json({
        message: "user doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "user data",
        user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//delete Seller///
exports.deleteUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findOneAndDelete({ _id: userid });
   if (!user) {
      return res.status(200).json({
        message: "user doesn't exist",
      });
    } else {
      return res.status(200).json({
        message: "Deleted Succefully",
        
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Update seller
exports.UserUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true }; // Return the updated record
  if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const userupdate = await User.findByIdAndUpdate(id, update, options);
    if (!userupdate) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    return res.status(200).json({
      message: "user updated",
      userupdate,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};