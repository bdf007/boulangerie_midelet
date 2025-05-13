const express = require("express");
const router = express.Router();

// import controllers
const {
  createAbout,
  getAllAbouts,
  getAboutById,
  getAboutActive,
  updateAbout,
  deleteAbout,
} = require("../controllers/about");

// import middlewares
const { verifyToken } = require("../middlewares/auth");

// api routes
router.post("/about/create", verifyToken, createAbout);
router.get("/abouts", getAllAbouts);
router.get("/activeAbout", getAboutActive);
router.put("/about/update/:id", verifyToken, updateAbout);
router.delete("/about/delete/:id", verifyToken, deleteAbout);
router.get("/about/:id", getAboutById);

module.exports = router;
