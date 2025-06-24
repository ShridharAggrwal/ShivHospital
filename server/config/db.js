const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  console.log("Loading environment variables from:", envPath);
  dotenv.config({ path: envPath });
} else {
  console.warn(".env file not found at:", envPath);
  dotenv.config(); // Try to load from process.env
}

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI is not defined in the environment variables.");
      console.error("Available environment variables:", Object.keys(process.env).filter(key => !key.includes('KEY')));
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    // Don't exit in development mode to allow testing with mock data
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;