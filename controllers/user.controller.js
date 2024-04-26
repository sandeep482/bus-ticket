const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const UserModel = require("../models/user.model");

const router = express.Router();

// User signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "Email already exists. Please try with a different email.",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      status: "Success",
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found. Please check your email.",
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "Failed",
        message: "Incorrect password. Please check your password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    return res.status(200).json({
      status: "Success",
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        // Add more user properties if needed
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
