const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require('./routes/staffRoutes');

require('dotenv').config();

const connectDB = require("./config/db");

const app = express();

//connect to mongodb 
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",staffRoutes);
app.use('/api/auth',adminRoutes);

//api running
app.get('/',(req,res)=>{
    res.send('API is running...')
})

//start server 
const PORT = process.env.PORT || 8080;
app.listen(PORT , () =>{
    console.log(`server running on port: ${PORT}`);
})