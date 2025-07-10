const express = require("express");
const cors = require("cors");

// Load environment variables first
require('dotenv').config();

// Add debugging for path-to-regexp
process.env.DEBUG = 'express:router';

// Import routes after environment is loaded
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require('./routes/staffRoutes');
const connectDB = require("./config/db");

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Whitelist specific origins
    const allowedOrigins = [
      'https://shivhospitalpatients.netlify.app',
      'http://localhost:5173', // Local development
      'http://localhost:3000'  // Alternative local development port
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // For development purposes, allow all origins
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Parse JSON requests
app.use(express.json());

// Keep-alive endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// API running endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
connectDB();

// Apply routes
try {
  app.use("/api/auth", staffRoutes);
  app.use('/api/auth', adminRoutes);
  console.log("Routes registered successfully");
} catch (error) {
  console.error("Error registering routes:", error);
  process.exit(1);
}

// Global error handler for path-to-regexp errors - MUST be after routes
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  
  if (err instanceof TypeError && err.message.includes('pathToRegexpError')) {
    console.error('Path-to-regexp error:', err.message);
    return res.status(500).json({ 
      message: 'Server configuration error', 
      error: 'Invalid route pattern'
    });
  }
  next(err);
});

// Catch-all error handler - MUST be last middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});