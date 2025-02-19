const express = require("express")
const registrationControllers = require("../controllers/registrationControllers")
const paymentControllers = require("../controllers/paymentControllers")

const router = express.Router();

router.post("/registration",registrationControllers.tuitionBooking)
router.get("/hello",registrationControllers.Hello)

router.post("/stk",paymentControllers.handlePayment)

module.exports = router