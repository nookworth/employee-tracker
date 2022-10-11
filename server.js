const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
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
  return (
    inquirer
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

        //Question for adding a department
        {
          type: "input",
          message: "Please enter the department name",
          name: "department",
          when: (answers) => answers.menu == "Add a department",
        },

        // Group of questions about adding a role
        {
          type: "input",
          message: "Please enter the role title",
          name: "roleTitle",
          when: (answers) => answers.menu == "Add a role",
        },
        {
          type: "input",
          message: "Please enter the salary for the role",
          name: "roleSalary",
          when: (answers) => answers.roleTitle,
          // validate: (answer) => {
          //   if (typeof answer != Number) {
          //     return "Please enter your answer as a number with no commas";
          //   }
          //   return true;
          // },
        },
        {
          type: "input",
          message: "Please enter the department ID in which the role exists",
          name: "roleDept",
          when: (answers) => answers.roleSalary,
          // validate: (answer) => {
          //   if (typeof answer != Number) {
          //     return "Please enter your answer as an integer";
          //   }
          //   return true;
          // },
        },

        // Group of questions about adding an employee
        {
          type: "input",
          message: "Please enter the employee's first name",
          name: "employeeName",
          when: (answers) => answers.menu == "Add an employee",
        },
        {
          type: "input",
          message: "Please enter the employee's last name",
          name: "employeeSurname",
          when: (answers) => answers.employeeName,
        },
        {
          type: "input",
          message: "Please enter the employee's role ID",
          name: "employeeRole",
          when: (answers) => answers.employeeSurname,
        },
        {
          type: "input",
          message: "Please enter the employee's manager's ID",
          name: "employeeManager",
          when: (answers) => answers.employeeRole,
        },
      ])
      //One .then handles all possible answers
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
        if (response.department) {
          addDepartment(JSON.stringify(response.department));
        }
        // Call the addRole function when the last question in the role chain is finished
        if (response.roleDept) {
          addRole(
            JSON.stringify(response.roleTitle),
            response.roleSalary,
            response.roleDept
          );
        }
        //Call the addEmployee function when the last question in the employee chain is finished
        if (response.employeeManager) {
          addEmployee(
            JSON.stringify(response.employeeName),
            JSON.stringify(response.employeeSurname),
            response.employeeRole,
            response.employeeManager
          );
        }
      })
  );
};

init();

const viewDepartments = () => {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
};

const viewRoles = () => {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
};

const viewEmployees = () => {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
};

const addDepartment = (departmentName) => {
  db.query(`INSERT INTO department (name) VALUES (${departmentName})`);
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
};

const addRole = (title, salary, department_id) => {
  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES (${title}, ${salary}, ${department_id})`
  );
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${first_name}, ${last_name}, ${role_id}, ${manager_id})`
  );
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
