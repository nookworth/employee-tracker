const express = require("express");
const mysql = require("mysql2");
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// db.query(
//   `INSERT INTO department (id, name)
// VALUES
//     ( 1, "Engineering"),
//     ( 2, "Human Resources"),
//     ( 3, "Marketing");`,
//   (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   }
// );

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
