const pool = require("../db");

const fetchPrograms = async(req,res)=>{
    try{
        const query = "SELECT * FROM programmes"
        pool.query(query,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                res.status(200).json(results);
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {fetchPrograms}