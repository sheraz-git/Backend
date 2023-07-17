const User = require("../../models/userModel");
const validateRegisterInput=require("../../Validation/userRegisterValidation")
const validateLoginInput=require("../../Validation/userLoginValidation")
const ErrorHandler = require("../../utils/errorHandler.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { forUserEmail } = require("../Emails/email");
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

exports.userRegister = async (req, res, next) => {
  try {
    // Validate user input
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

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
      country,
    } = req.body;
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already Exist", 400));
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
      language,
    });

    // Save the user to the database
    const userSave = await newUser.save();
    if (!userSave) {
      return next(new ErrorHandler("User registration failed", 404));
    }

    // const userId = usersave._id;
    await forUserEmail(first_name, last_name, email, userSave._id);

    return res.status(201).json({
      message: "User created and email sent successfully",
      data: newUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error));
  }
};
// User login controller

exports.userLogin = async (req, res, next) => {
  try {
    // Validate user input
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "-_id");

    if (!user) {
      return next(new ErrorHandler("User Email and Password doesn't exist", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email and Password", 404));
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
    return next(new ErrorHandler());
  }
};
// Get all users controller
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password").populate("country");

    if (users.length === 0) {
      return next(new ErrorHandler("No User Found", 404));
    } else {
      return res.status(200).json({
        message: "All user data",
        count: users.length,
        users,
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Get single user controller
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("country","country");

    if (!user) {
      return next(new ErrorHandler("User not Found", 404));
    } else {
      return res.status(200).json({
        message: "User data",
        user,
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Delete user controller
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(new ErrorHandler("User not Found", 404));
    } else {
      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Update user controller
exports.userUpdate = async (req, res, next) => {
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
      language,
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
      language,
    };

    const userUpdate = await User.findByIdAndUpdate(id, update, options);

    if (!userUpdate) {
      return next(new ErrorHandler("User not Found", 404));
    }

    return res.status(200).json({
      message: "User updated",
      user: userUpdate,
    });
  } catch (error) {
    return next(new ErrorHandler());
  }
};
// Get single user controller
exports.getTopSeller = async (req, res, next) => {
  try {
    const users = await User.find()
      .limit(5)
      .populate({ 
        path: "country",
        select: "country"
      }) .populate({ 
        path: "role",
        select: "role"
      })


    if (!users) {
      return next(new ErrorHandler("No Users Found", 404));
    } else {
      return res.status(200).json({
        message: "User data",
        count: users.length,
        users,
      });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};