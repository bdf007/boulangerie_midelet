const { check, validationResult } = require("express-validator");
const User = require("../models/user");

exports.userRegisterValidator = [
  // username is not null
  check("username", "Username is required").notEmpty(),
  // firstname is not null
  check("firstname", "Firstname is required").notEmpty(),
  // lastname is not null
  check("lastname", "Lastname is required").notEmpty(),
  // email is not null, valid and normalized
  check("email", "Email is required").notEmpty(),
  check("email", "Email is not valid").isEmail(),
  // check for password
  check("password", "Password is required").notEmpty(),
  check("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
  check(
    "password",
    "Password must contain at least one numeric digit, one uppercase, one lowercase, and one special character"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/),

  // Middleware pour gérer les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ error: firstError });
    }
    next();
  },
];

// Middleware to get user by ID
exports.userById = async (req, res, next) => {
  try {
    const user = await User.findById(req._id).exec();
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error bis" });
  }
};
