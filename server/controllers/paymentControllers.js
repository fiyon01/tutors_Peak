const pool = require("../db");

const handlePayment = async(req,res)=>{
    const {phoneNumber,Amount} = req.body
    console.log({phoneNumber,Amount})
    if(phoneNumber && Amount){
        console.log("Data received")
    }
}

module.exports = {handlePayment}