const nodemailer = require("nodemailer");
const User = require("../models/userModel");
exports.forUserEmail = async function (first_name, last_name, email, userId) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });


    let mailOptions = {
      to: email,
      subject: "New User Registration",
      html: `<h1>Hello Sheraz,</h1>
            <p>A new user has registered on the freelancing site.</p>
            <p>Name: ${first_name} ${last_name}</p>
            <p>Email: ${email}</p>
            <p>Please take necessary actions.</p>
            <p>Click the following link to see the user details:</p>
            <p><a href="http://localhost:3001/#/loading/${userId}">User Details</a></p>
            <h2>Thank and Regards</h2>
            <h2>ZNZ Communication</h2>
            `
    };
    
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};
exports.userEmailVerification = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log("🚀 ~ file: email.js:45 ~ exports.userEmailVerification= ~ userId:", userId)
 
    const user = await User.findById(userId);
    // console.log("🚀 ~ file: email.js:48 ~ exports.userEmailVerification= ~ user:", user)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      user.email_verification = true; // Update the email verification status to true
      await user.save(); // Save the updated user object

      return res.status(200).json({
        message: "Email verification successful",
      });
    }
  } catch (error) {
    console.error(error); // Log the error message for debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.forContactUs = async function ( name, email, subject, phone_no,description) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "sherazabbas669@gmail.com",
        pass: "dyoonnvupsqlgzjy",
      },
    });

    let mailOptions = {
      to: "sherazabbas669@gmail.com",
      subject: `${subject}`,
      html: `<h1> ${name} ,welcome to this freelancing site</h1>
            <h2>Your Login Credentials for our portal are given below: (Please do not share with anyone!!)</h2>
            <h3> Email: ${email} </h3>
            <h3> description: ${description} </h3> 
            <h4>Phone no: ${phone_no} </h4>`,
    };

    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);

    console.log("Email sent successfully", info);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
};




