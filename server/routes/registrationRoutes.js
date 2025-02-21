const dotenv =require("dotenv");
const axios = require("axios");
dotenv.config();

const generateToken = async (req, res, next) => {
  const secret = process.env.MPESA_SECRET;
  const consumer = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");  // Updated Buffer method

  try {
      console.log("Making request to generate token...");

      // Make request to the M-Pesa API to generate the token
      const response = await axios.get(" https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
          headers: {
              "Authorization": `Basic ${auth}`,
              "Accept": "application/json",
              "Content-Type": "application/json"  // Added content type for the request
          }
      });

      if (response.status === 200) {
          console.log('Access Token:', response.data);
          req.token = response.data.access_token; // Save the token for use in the next middleware
          next();  // Pass the request to the next middleware
      } else {
          console.log(`Error: ${response.status}`);
          res.status(response.status).send({ message: 'Failed to get access token', error: response.data });
      }
  } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).send({ message: 'Error generating token', error: error.message });
  }
};
const express = require("express")
const registrationControllers = require("../controllers/registrationControllers")
const paymentControllers = require("../controllers/paymentControllers")
const router = express.Router();

router.post("/registration",registrationControllers.tuitionBooking)
router.get("/fetchprograms",registrationControllers.fetchPrograms)
router.post("/stk",generateToken,paymentControllers.handlePayment)

module.exports = router