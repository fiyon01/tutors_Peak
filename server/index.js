const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql2");
const axios = require("axios")
const pool = require("./db");
const dotenv = require("dotenv");
const routes = require("./routes/registrationRoutes");

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://peakperformancetutoring.vercel.app',
  'http://localhost:5173',
  'http://localhost:3500',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],  // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow necessary headers
}));

// If you don't have a specific handler for preflight requests, the following line will work:
app.options('*', cors());



app.use(express.json());
app.use(morgan("combined"));
app.use("/api", routes);

app.get("/api/programs",(req,res)=>{
  try {
    const query = "SELECT * FROM programmes";
    pool.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching programs:", error);
        return res.status(500).json({ message: "Error fetching programs", error: error.message });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
})

// The serverless function handler
app.listen(3500,()=>{
  console.log("server running on port 3500")
}
)