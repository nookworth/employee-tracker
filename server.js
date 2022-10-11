const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

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

const init = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Please select an option.",
        name: "menu",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
      {
        type: "input",
        message: "Please enter the department name",
        name: "department",
        when: (answers) => answers.menu == "Add a department",
      },
    ])
    .then((response) => {
      if (response.menu == "View all departments") {
        viewDepartments();
      }
      if (response.menu == "View all roles") {
        viewRoles();
      }
      if (response.menu == "View all employees") {
        viewEmployees();
      }
      if (response.menu == "Add a department") {
        addDepartment(response.department);
      }
    });
};

init();

const viewDepartments = () => {
  db.query("SELECT * FROM department", function (err, results) {
    console.log(results);
  });
};

const viewRoles = () => {
  db.query("SELECT * FROM role", function (err, results) {
    console.log(results);
  });
};

const viewEmployees = () => {
  db.query("SELECT * FROM employee", function (err, results) {
    console.log(results);
  });
};

const addDepartment = (departmentName) => {
  db.query(
    `INSERT INTO department (name) VALUES (${departmentName})`,
    function (err, results) {
      console.log(results);
    }
  );
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
