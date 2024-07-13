const asyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
//@desc Register a user
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if all required fields are present
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
  
    // Check if the user already exists
    const userAvailable = await userModel.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
  
    // Create a new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${newUser}`);
  
    // Send the appropriate response based on whether the user creation was successful
    if (newUser) {
      res.status(201).json({ _id: newUser.id, email: newUser.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  });

//@desc Register a user
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "Login the User" });
});

//@desc Register a user
//@route POST /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current User Info" });
});

module.exports = { registerUser, loginUser, currentUser };
