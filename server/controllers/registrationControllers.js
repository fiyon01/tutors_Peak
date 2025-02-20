const pool = require("../db");

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

module.exports = { tuitionBooking,Hello };
