const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require('./routes/staffRoutes');

require('dotenv').config();

const connectDB = require("./config/db");

const app = express();

//connect to mongodb 
connectDB();

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
      // In a production environment, you might want to restrict this
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

app.use(express.json());

// Routes
app.use("/api/auth",staffRoutes);
app.use('/api/auth',adminRoutes);

// Keep-alive endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

//api running
app.get('/',(req,res)=>{
    res.send('API is running...')
})

//start server 
const PORT = process.env.PORT || 8080;
app.listen(PORT , () =>{
    console.log(`server running on port: ${PORT}`);
})