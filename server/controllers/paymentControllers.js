const axios = require("axios");
const dotenv =require("dotenv");
const moment = require("moment");  // For generating the timestamp
dotenv.config()


const handlePayment = async(req, res) => {
  const phoneNumber = req.body.phoneNumber.substring(1);
  const Amount = req.body.Amount

  // Dynamically generate the Timestamp (in the format YYYYMMDDHHMMSS)
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const passkey = process.env.PASSKEY
  // Fetch environment variables (this assumes you have these set up in your .env file)
  const businessShortcode = process.env.BUSINESS_SHORTCODE; // e.g., 174379
  const password = Buffer.from(businessShortcode + passkey + timestamp).toString("base64") ;  // Your password for the STK push (encoded base64 format)
  const phoneNumberWithCountryCode = `254${phoneNumber}`;
  // M-Pesa STK Push API endpoint


  try {
    const token = req.token
    // Making the POST request to M-Pesa API
    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: businessShortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Amount,
      PartyA: phoneNumberWithCountryCode,  // The phone number making the payment
      PartyB: businessShortcode,          // The shortcode receiving the payment
      PhoneNumber: phoneNumberWithCountryCode,  // The phone number making the payment
      CallBackURL: "https://mydomain.com/pat",  // The callback URL
      AccountReference: phoneNumberWithCountryCode,           // Your reference
      TransactionDesc: "Payment for services" // Description
    },{
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });

    // Log the response for debugging purposes
    console.log("M-Pesa Response:", response.data);

    // Send the response back to the client
    return res.status(200).json({ message: "Payment request sent successfully", data: response.data });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Error processing payment", error: error.message });
  }
};

module.exports = { handlePayment };
