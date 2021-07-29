INSERT INTO Department (name)
VALUES 
    ("Sales"),
    ("Finance"),
    ("Legal"),
    ("Engineering");


INSERT INTO Role (title, salary, department_id)
VALUES 
    ("Sales Lead", 90, 1),
    ("Sales Marketing", 78, 1),
    ("Client Services", 65, 1),
    ("Account Manager", 95, 2),
    ("Finance Analyst", 75, 2),
    ("Legal Team Lead", 150, 3),
    ("Contract Admin", 105, 3),
    ("Lawyer", 85, 3),
    ("Lead Engineer", 160, 4),
    ("Software Engineer", 95, 4),
    ("Systems Engineer", 95, 4);


INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Tom", "Smith", 1, NULL),
    ("Billy", "Ray", 3, 1),
    ("Susan", "Wilson", 4, NULL),
    ("Morgan", "Allen", 9, NULL),
    ("Lee", "Hub", 10, 4),
    ("Jill", "Chambers", 6, NULL);