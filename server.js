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

const menu = () => {
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
            "View employees by manager",
            "View employees by department",
            "View total utilized budget of a department",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Update an employee role",
            "Update an employee's manager",
          ],
        },

        {
          type: "input",
          message: "Please enter the department id",
          name: "deptBudget",
          when: (answers) =>
            answers.menu == "View total utilized budget of a department",
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
        },
        {
          type: "input",
          message: "Please enter the department ID in which the role exists",
          name: "roleDept",
          when: (answers) => answers.roleSalary,
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

        //Question for deleting an employee
        {
          type: "input",
          message: "Enter the ID of the employee you wish to delete.",
          name: "deleteEmployee",
          when: (answers) => answers.menu == "Delete an employee",
        },

        //Question for deleting a department
        {
          type: "input",
          message: "Enter the ID of the department you wish to delete.",
          name: "deleteDept",
          when: (answers) => answers.menu == "Delete a department",
        },

        //Question for deleting a role
        {
          type: "input",
          message: "Enter the ID of the role you wish to delete.",
          name: "deleteRole",
          when: (answers) => answers.menu == "Delete a role",
        },

        //Group of questions for updating an employee
        {
          type: "input",
          message: "Please enter the ID of the employee you wish to update.",
          name: "employeeUpdate",
          when: (answers) => answers.menu == "Update an employee role",
        },
        {
          type: "input",
          message: "Please enter the ID of the new role for this employee.",
          name: "newRole",
          when: (answers) => answers.employeeUpdate,
        },

        //Group of questions for updating an employee's manager
        {
          type: "input",
          message: "Please enter the ID of the employee you wish to update.",
          name: "employeeUpdateManager",
          when: (answers) => answers.menu == "Update an employee's manager",
        },
        {
          type: "input",
          message: "Please enter the ID of the new manager for this employee.",
          name: "newManager",
          when: (answers) => answers.employeeUpdateManager,
        },
      ])

      //One .then handles all possible answers
      .then((response) => {
        if (response.menu == "View all departments") {
          viewDepartments();
          menu();
        } else if (response.menu == "View all roles") {
          viewRoles();
          menu();
        } else if (response.menu == "View all employees") {
          viewEmployees();
          menu();
        } else if (response.menu == "View employees by manager") {
          viewEmployeesByManager();
          menu();
        } else if (response.menu == "View employees by department") {
          viewEmployeesByDept();
          menu();
        } else if (
          response.menu == "View total utilized budget of a department"
        ) {
          totalUtilizedBudget(JSON.stringify(response.deptBudget));
          menu();
        } else if (response.department) {
          addDepartment(JSON.stringify(response.department));
          menu();
        }

        // Call the addRole function when the last question in the role chain is finished
        else if (response.roleDept) {
          addRole(
            JSON.stringify(response.roleTitle),
            response.roleSalary,
            response.roleDept
          );
          menu();
        }

        //Call the addEmployee function when the last question in the employee chain is finished
        else if (response.employeeManager) {
          addEmployee(
            JSON.stringify(response.employeeName),
            JSON.stringify(response.employeeSurname),
            response.employeeRole,
            response.employeeManager
          );
          menu();
        }

        //Call the deleteEmployee function
        else if (response.deleteEmployee) {
          deleteEmployee(response.deleteEmployee);
          menu();
        }

        //Call the deleteDept function
        else if (response.deleteDept) {
          deleteDept(response.deleteDept);
          menu();
        }

        //Call the deleteRole function
        else if (response.deleteRole) {
          deleteRole(response.deleteRole);
          menu();
        }

        //Call the updateEmployee function when the last question in the update chain is finished
        else if (response.newRole) {
          updateEmployeeRole(response.employeeUpdate, response.newRole);
          menu();
        } else if (response.newManager) {
          updateEmployeeManager(
            response.employeeUpdateManager,
            response.newManager
          );
          menu();
        }
      })
  );
};

menu();

//Function definitions
const viewDepartments = () => {
  db.query("SELECT * FROM department", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const viewRoles = () => {
  db.query("SELECT * FROM role", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const viewEmployees = () => {
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const viewEmployeesByManager = () => {
  db.query(
    "SELECT manager_id, id, first_name, last_name, role_id FROM employee ORDER BY manager_id",
    function (err, results) {
      console.log("\n");
      console.table(results);
    }
  );
};

const viewEmployeesByDept = () => {
  db.query(
    "SELECT department.id AS department_id, employee.id AS employee_id, employee.first_name, employee.last_name FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department.id;",
    function (err, results) {
      console.log("\n");
      console.table(results);
    }
  );
};

const totalUtilizedBudget = (id) => {
  db.query(
    `SELECT department.id AS department_id, COUNT(employee.id) AS num_employees, SUM(salary) AS total_utilized_budget FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ${id} GROUP BY department.id;`,
    function (err, results) {
      console.log("\n");
      console.table(results);
    }
  );
};

const addDepartment = (departmentName) => {
  db.query(`INSERT INTO department (name) VALUES (${departmentName})`);
  db.query("SELECT * FROM department", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const addRole = (title, salary, department_id) => {
  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES (${title}, ${salary}, ${department_id})`
  );
  db.query("SELECT * FROM role", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${first_name}, ${last_name}, ${role_id}, ${manager_id})`
  );
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const deleteEmployee = (id) => {
  db.query(`DELETE FROM employee WHERE id = ${id}`);
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const deleteDept = (id) => {
  db.query(`DELETE FROM department WHERE id = ${id}`);
  db.query("SELECT * FROM department", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const deleteRole = (id) => {
  db.query(`DELETE FROM role WHERE id = ${id}`);
  db.query("SELECT * FROM role", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const updateEmployeeRole = (employee_id, role_id) => {
  db.query(
    `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`
  );
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

const updateEmployeeManager = (employee_id, manager_id) => {
  db.query(
    `UPDATE employee SET manager_id = ${manager_id} WHERE id = ${employee_id}`
  );
  db.query("SELECT * FROM employee", function (err, results) {
    console.log("\n");
    console.table(results);
  });
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
