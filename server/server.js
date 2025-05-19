const express = require("express");
const compression = require("compression");
const { json, urlencoded } = require("express");
const cors = require("cors");
const app = express();
const connection = require("./config/db");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// compress all responses
app.use(compression());

// get the routes
const userRoutes = require("./routes/user");
// get the about routes
const aboutRoutes = require("./routes/about");
// get the review routes
const reviewRoutes = require("./routes/review");

// Middleware
app.use(json({ limit: "50mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(",") ?? "http://localhost:3000",
    credentials: true,
  })
);

app.use(urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());

// Connect to database
connection();

// Server static assets if in production

app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Route de test
app.get("/", (req, res) => {
  res.send("API Running smoothly!");
});

// User routes
app.use("/api", userRoutes);
// About routes
app.use("/api", aboutRoutes);
// Review routes
app.use("/api", reviewRoutes);

// Handle React routing, return all requests to React app

// serve the react app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// Port
const PORT = process.env.PORT || 8000;

// Listen to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
