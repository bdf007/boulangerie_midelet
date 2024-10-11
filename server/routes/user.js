const express = require("express");
const router = express.Router();

// import user controller
const {
  userRegister,
  userLogin,
  userLogout,
  getLoggedInUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserById,
  updateUserProfile,
  deleteUser,
  deleteUserById,
} = require("../controllers/user");

// import auth middleware
const { userRegisterValidator, userById } = require("../middlewares/userLogin");
const { verifyToken } = require("../middlewares/auth");

// api routes
router.post("/register", userRegisterValidator, userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.get("/user", verifyToken, getLoggedInUser);
router.get("/users", verifyToken, getAllUsers);
router.get("/user/:id", verifyToken, userById, getUserById);
router.put("/user/update", verifyToken, updateUser);
router.put("/user/update/:id", verifyToken, userById, updateUserById);
router.put("/user/profile", verifyToken, updateUserProfile);
router.delete("/user/delete", verifyToken, deleteUser);
router.delete("/user/delete/:id", verifyToken, userById, deleteUser);

module.exports = router;
