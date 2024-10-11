const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function connection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Could not connect to the database. Error: ", error.message);
    process.exit(1); // Terminer l'application si la connexion échoue
  }
};
