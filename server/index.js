const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql2");
const axios = require("axios")
const dotenv = require("dotenv");
const routes = require("./routes/registrationRoutes");

dotenv.config();
const app = express();

const allowedOrigins = [
  'https://peakperformancetutoring.vercel.app',
  'http://localhost:5173',
  'http://localhost:3500', // Add this origin
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Enable if you need to send cookies
}));


app.use(express.json());
app.use(morgan("combined"));
app.use("/api", routes);



// The serverless function handler
app.listen(3500,()=>{
  console.log("server running on port 3500")
}
)