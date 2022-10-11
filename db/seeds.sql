INSERT INTO department (id, name)
VALUES  
    (1, "Engineering"),
    (2, "HR"),
    (3, "Marketing");

INSERT INTO role (id, title, salary, department_id)
VALUES  
    (1, "Front End Engineer", 75000.00, 1),
    (2, "Back End Engineer", 80000.00, 1),
    (3, "Investigator", 85000.00, 2),
    (4, "Director of Marketing", 100000.00, 3);

    INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  
    (1, "Johnathon", "Jacobson", 1, 1),
    (2, "Sally", "Sallo", 1, 1),
    (3, "Ang", "Lee", 2, 1),
    (4, "Ingmar", "Bergman", 3, 2),
    (5, "Ingrid", "Bergman", 4, 3);