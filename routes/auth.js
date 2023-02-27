const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const ejs = require("ejs");
require("dotenv").config();

const User = require("../models/User");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

const {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
} = require("../validators/auth");

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;

// async function sendMail(receiverMail, data) {
const sendMail = async (receiverMail, data) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_FROM,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: receiverMail,
      subject: "PASSWORD RESET LINK - CRM Application",
      html: data,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

const createAdmin = async () => {
  const ADMIN_CREDENTIAL = JSON.parse(process.env.ADMIN_CREDENTIAL);
  const { error } = registerValidation(ADMIN_CREDENTIAL);
  if (error) {
    console.log("message: ", error.details[0].message);
  }

  // Check for no duplicate email
  const userMatch = await User.findOne({ email: ADMIN_CREDENTIAL.email });
  if (userMatch) {
    console.log("Admin email address already used");
  } else {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(ADMIN_CREDENTIAL.password, salt);

    const newUser = new User({
      firstName: ADMIN_CREDENTIAL.firstName,
      lastName: ADMIN_CREDENTIAL.lastName,
      email: ADMIN_CREDENTIAL.email,
      password: hashPassword,
      role: "Admin",
    });

    try {
      const savedUser = await newUser.save();
      console.log("Admin account has been created successfully");
    } catch (error) {
      // console.log("Email address already used",error);
    }
  }
};

router.post("/createuser", verifyToken, async (req, res) => {
  // Validate registration form data
  // delete confirm password cause validation schema does not have this field
  delete req.body.confirmPassword;
  const { error } = registerValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ status: false, message: error.details[0].message });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    if (req.body.id) {
      let users = await User.findOne({ _id: req.body.id });

      if (users.email !== req.body.email) {
        // Check for no duplicate email
        const userMatch = await User.findOne({ email: req.body.email });
        if (userMatch) {
          return res.status(400).json({
            status: false,
            message: "Email address already used",
            role: userMatch.role,
          });
        }
      }

      users.firstName = req.body.firstName;
      users.lastName = req.body.lastName;
      users.email = req.body.email;
      users.password = hashPassword;
      users.role = "Employee";

      const savedUser = await users.save();
      res.status(201).json({
        status: true,
        message: "Account updated successfully",
        role: users.role,
      });
    } else {
      // Check for no duplicate email
      const userMatch = await User.findOne({ email: req.body.email });
      if (userMatch) {
        return res.status(400).json({
          status: false,
          message: "Email address already used",
          role: userMatch.role,
        });
      }

      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: "Employee",
      });

      const savedUser = await newUser.save();
      res.status(201).json({
        status: true,
        message: "Account has been created successfully",
        role: newUser.role,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Unable to create account",
    });
  }
});

router.post("/login", async (req, res) => {
  // Validate login form data
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ status: false, message: error.details[0].message });
  }

  const userMatch = await User.findOne({ email: req.body.email });
  if (userMatch) {
    // Validate the password using bcrypt
    const submittedPass = req.body.password;
    const savedPass = userMatch.password;

    // Compare hash and plain password
    const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
    if (passwordDidMatch) {
      // Create and assign new token
      const token = jwt.sign(
        {
          _id: userMatch._id,
          name: `${userMatch.firstName} ${userMatch.lastName}`,
          email: userMatch.email,
          role: userMatch.role,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.header("auth-token", token).json({
        status: true,
        user: `${userMatch.firstName} ${userMatch.lastName}`,
        role: userMatch.role,
        message: `Login successfully as a ${userMatch.role}`,
        token: token,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Invalid username or password",
      });
    }
  } else {
    // Cause a delay to avoid brute force attacks.
    let fakePass = `$2b$10$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
    await bcrypt.compare(req.body.password, fakePass);

    res
      .status(401)
      .json({ status: false, message: "Invalid username or password" });
  }
});

// router.post("/forget-password", async (req, res) => {
//   // Validate forget password form data
//   const { error } = forgetPasswordValidation(req.body);
//   if (error) {
//     return res.status(400).send({ message: error.details[0].message });
//   }

//   try {
//     const userMatch = await User.findOne({ email: req.body.email });
//     if (userMatch) {
//       // Create and assign new token with expiration time
//       const token = jwt.sign(
//         {
//           _id: userMatch._id,
//           name: `${userMatch.firstName} ${userMatch.lastName}`,
//           email: userMatch.email,
//           role: userMatch.role,
//         },
//         process.env.TOKEN_SECRET,
//         { expiresIn: "2m" }
//       );

//       const link =`https://sridharrajaram-crmapp.herokuapp.com/api/auth/reset-password/${userMatch._id}/${token}`;

//       const data = await ejs.renderFile(
//         path.join(__dirname, "..", "views", "mail-template.ejs"),
//         {
//           link: link,
//         }
//       );

//       await sendMail(userMatch.email, data);

//       res.send(
//         "Password reset link has been sent to your email. Please check your mailbox."
//       );
//     } else {
//       res.status(401).json({
//         message: "This email is not registered",
//       });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(401).json({
//       message: "This email is not registered",
//     });
//   }
// });

// router.get("/reset-password/:id/:token", verifyToken, (req, res) => {
//   res.render(path.join(__dirname, "..", "views", "reset-password.ejs"));
// });

// router.post("/reset-password/:id/:token", verifyToken, async (req, res) => {
//   const { error } = resetPasswordValidation(req.body);
//   if (error) {
//     return res
//       .status(400)
//       .send(error.details[0].message + ". Please Try again");
//   }

//   try {
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(req.body.password, salt);

//     await User.findOneAndUpdate(
//       { _id: req.user._id },
//       { password: hashPassword }
//     );
//     res.send(
//       "Your password has been changed successfully. Please login with your new password"
//     );
//   } catch (err) {
//     res.status(500).send("Something went wrong. Please try again");
//   }
// });

module.exports = { router, createAdmin };
