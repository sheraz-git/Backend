const User = require("../../models/userModel");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { forUserEmail } = require("../email");
cloudinary.config({
  cloud_name: "dsv28ungz",
  api_key: "775634257667667",
  api_secret: "6jMBqRlVALHfbR8udrS3fUf4m1A",
});

//Upload image controllers
exports.uploadImage = async (req, res) => {
  try {
    const file1 = req.files.file;
    const result1 = await cloudinary.uploader.upload(file1.tempFilePath);

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: result1.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
       message: "Server error",
    });
  }
};
// User signup controller
exports.userRegister = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      phone_no,
      service_Description,
      date_of_birth,
      address,
      account_status,
      email_verification,
      language,
      role,
      country
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Create a new user
    const newUser = new User({
      image: req.body.image, // Image URL from the request body
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      role,
      country,
      phone_no,
      service_Description,
      date_of_birth,
      address,
      account_status,
      email_verification,
      language
    });

    // Save the user to the database
    const usersave=await newUser.save();
    if (!usersave) {
      return res.status(500).json({
        message: "User registration failed",
      });
    }
    else{
      console.log(usersave._id);
     const userId= usersave._id; 
      await forUserEmail(first_name, last_name,email,userId);
    }
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
// User login controller
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role","-_id");

    if (!user) {
      return res.status(404).json({
        message: "User(Email and Password) doesn't exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, "paypal", { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          
          // Include any other relevant user data you want to return
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Get all users controller
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate("country");

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found",
      });
    } else {
      return res.status(200).json({
        message: "All user data",
        count: users.length,
        users,
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
// Get single user controller
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("country");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        message: "User data",
        user,
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
// Delete user controller
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
// Update user controller
exports.userUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      phone_no,
      service_Description,
      country,
      date_of_birth,
      address,
      account_status,
      email_verification,
       language
    } = req.body;
    const options = { new: true }; // Return the updated record

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const update = {
      first_name,
      last_name,
      email,
      password,
      service_Title,
      hourly_rate,
      phone_no,
      service_Description,
      country,
      date_of_birth,
      address,
      account_status,
      email_verification,
       language
    };

    const userUpdate = await User.findByIdAndUpdate(id, update, options);

    if (!userUpdate) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated",
      user: userUpdate,
    });
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};
