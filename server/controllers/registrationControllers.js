const pool = require("../db");
const axios = require("axios");
const dotenv =require("dotenv");
const moment = require("moment");  // For generating the timestamp
dotenv.config()

const tuitionBooking = (req, res) => {
    const { students, parentDetails } = req.body;
    
    if (!parentDetails || !parentDetails.name || !parentDetails.phone) {
        return res.status(400).send({ message: "Parent details are required" });
    }

    if (!students.length) {
        return res.status(400).send({ message: "No students provided" });
    }

    const { name, phone,email } = parentDetails;

    // Check if parent already exists based on the phone number
    const parentQuery = "SELECT id FROM parents WHERE phone = ? OR name = ?";
    pool.query(parentQuery, [phone,name], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: "Error in database query" });
        }

        // Parent exists, get parentId and insert students
        if (results.length > 0) {
            const parentId = results[0].id;

            // Insert multiple students in a single query
            const studentQuery = "INSERT INTO students (name, grade, parent_id) VALUES ?";
            const studentValues = students.map(student => [student.name, student.grade, parentId]);

            pool.query(studentQuery, [studentValues], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error inserting students" });
                }
                    return res.status(201).json({ message: "Created successfully" });
                
            });

        } else {
            // Parent does not exist, insert parent and students
            const insertParentQuery = "INSERT INTO parents (name, phone,email) VALUES (?, ?,?)";
            pool.query(insertParentQuery, [name, phone,email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error inserting parent" });
                }

                const parentId = result.insertId;
                const studentQuery = "INSERT INTO students (name, grade, parent_id) VALUES ?";
                const studentValues = students.map(student => [student.name, student.grade, parentId]);

                pool.query(studentQuery, [studentValues], (err, studentResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ message: "Error inserting students" });
                    }
                       return res.status(201).send({ message: "Parent and students added successfully", data: studentResult });
                    
                });
            });
        }
    });
};


const Hello = (req,res)=>{
    res.send("hello")
}

const fetchPrograms = async(req, res) => {
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
};


//payment



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





module.exports = { tuitionBooking,Hello,fetchPrograms,handlePayment };
