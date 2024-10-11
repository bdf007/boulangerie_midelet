const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register
exports.userRegister = async (req, res) => {
  // Check if username already exists
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) {
    return res.status(400).json({ error: "Username already exists" });
  }
  // Check if email already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json({ error: "Email already exists" });
  }
  // Create a new user
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};

// Login
exports.userLogin = async (req, res) => {
  // Check if the user exists
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // authenticate
    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({ error: "Email and password do not match" });
    }

    //  generate a token and put it in a cookie and send it to the client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, { expire: new Date() + 9999, httpOnly: true });

    // destructuring the user object
    const { _id, username, firstname, lastname, email, role } = user;
    return res.json({
      token,
      user: {
        message: "Login success",
        _id,
        username,
        firstname,
        lastname,
        email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout
exports.userLogout = (req, res) => {
  res.clearCookie("jwt");
  return res.json({ message: "Logout success" });
};

// get logged in user
exports.getLoggedInUser = (req, res) => {
  const { _id, username, firstname, lastname, email, role } = req.user;
  return res.json({
    _id,
    username,
    firstname,
    lastname,
    email,
    role,
    message: "User is still logged in",
  });
};

// get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const _id = req.user._id;
    //retreive user from db
    const user = await User.findById(_id);

    // check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // update user profile fields
    user.username = req.body.username || user.username;
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;

    // check if new password is provided
    if (req.body.newPassword) {
      // update password
      user.setPassword = req.body.password;
    }

    // save the updated user
    await user.save();

    // return success message
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
