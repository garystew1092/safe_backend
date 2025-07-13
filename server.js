require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Add fs module
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const addRoutes = require("./routes/addRoutes");
const viewRoutes = require("./routes/viewRoutes");
const userRoutes = require("./routes/userRoutes");
const user = require("./models/user");

const app = express();

// Check if uploads folder and uploads/profile folder exist, create if they don't
const uploadsDir = path.join(__dirname, "uploads");
const profileDir = path.join(uploadsDir, "profile");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads directory");
}

if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
    console.log("Created uploads/profile directory");
}

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/add", addRoutes);
app.use("/api/view", viewRoutes);
app.use("/api/user", userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port!! ${PORT}`));