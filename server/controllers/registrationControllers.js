const pool = require("../db");

const tuitionBooking = (req, res) => {
    const { students, parentDetails, totalPrice } = req.body;
    const { name, phone } = parentDetails;

    // Check if parent already exists based on the phone number
    const parentQuery = "SELECT id FROM parents WHERE phone = ?";
    pool.query(parentQuery, [phone], (err, results) => {
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

                // Insert one payment for the parent, not for each student
                const paymentQuery = "INSERT INTO payments (amount, parent_id) VALUES (?, ?)";
                pool.query(paymentQuery, [totalPrice, parentId], (err, paymentResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ message: "Error inserting payment" });
                    }
                    return res.status(201).json({ message: "Created successfully" });
                });
            });

        } else {
            // Parent does not exist, insert parent and students
            const insertParentQuery = "INSERT INTO parents (name, phone) VALUES (?, ?)";
            pool.query(insertParentQuery, [name, phone], (err, result) => {
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

                    // Insert one payment for the parent
                    const paymentQuery = "INSERT INTO payments (amount, parent_id) VALUES (?, ?)";
                    pool.query(paymentQuery, [totalPrice, parentId], (err, paymentResult) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ message: "Error inserting payment" });
                        }
                        return res.status(201).send({ message: "Parent and students added successfully", data: studentResult });
                    });
                });
            });
        }
    });
};


const Hello = (req,res)=>{
    res.send("hello")
}

module.exports = { tuitionBooking,Hello };
