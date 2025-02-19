const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const routes = require("./routes/registrationRoutes");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use("/api", routes);

// The serverless function handler
app.listen(3500,()=>{
  console.log("server running on port 3500")
}
)