//Access Command-line prompts
const inquirer = require('inquirer');
// Connect to the Database 
const db = require('./db/connection');
const mysql2 = require('mysql2');
const cTable = require('console.table');


// const manager = db.promise().query(`SELECT * from employee'`, (err, rows) =>{
//     if(err){
//         throw(err)
//     }
// })
const promptUser = () =>{
    return inquirer.prompt([
    {
        type: "list",
        name: "OPP",
        message: "What would you like to do?",
        choices: ["View All Employees", "View All Employees By Department", "View all Employees By Manager", "View All Departments", "View All Roles", "Add Employee", "Add Department" , "Add Role", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
    }
    ]) .then(answer => {
        //console.log(answer);
        directQuest(answer.OPP);
    })
}



const directQuest = desire => {
    //console.log(desire);
    switch(desire){
        case "View All Employees":
            db.query(`SELECT e.id, e.first_name, e.last_name, r.title AS Title, d.name AS Department, r.salary AS Salary, concat(e2.first_name,' ',e2.last_name) AS Manager
            FROM Employee e 
            LEFT JOIN Employee e2 ON e.manager_id = e2.id
            LEFT JOIN Role r ON e.role_id = r.id
            LEFT JOIN Department d ON r.department_id=d.id`, (err, rows) => {
            if (err){
                throw (err)
            } else {
                console.table(rows);
            
            }
            });
        startUp()
        break;
        case "View All Employees By Department":
            db.query(`SELECT d.id AS Department_ID, d.name, e.id AS Employee_ID, concat(e.first_name, ' ', e.last_name) AS Employee, r.title AS Title, r.salary AS Salary, concat(e2.first_name, ' ', e2.last_name) AS Manager
            FROM Employee e
            LEFT JOIN Employee e2 ON e.manager_id=e2.id
            LEFT JOIN Role r ON e.role_id = r.id
            LEFT JOIN Department d ON r.department_id = d.id ORDER BY d.id`, (err, rows) => {
                if (err) {
                    throw(err)
                    }
                console.table(rows);
                });
            startUp();
            break;
        case "View all Employees By Manager":
            db.query(`SELECT e.id AS Employee_ID, d.name AS Department, concat(e.first_name, ' ', e.last_name) AS Employee, r.title AS Title, r.salary AS Salary, concat(e2.first_name, ' ', e2.last_name) AS Manager
            FROM Employee e
            LEFT JOIN Employee e2 ON e.manager_id=e2.id
            LEFT JOIN Role r ON e.role_id = r.id
            LEFT JOIN Department d ON r.department_id = d.id
            GROUP BY d.id`, (err, rows) => {
                if (err) {
                    throw(err)
                }
                console.table(rows);
             });
            startUp();
             break;
        case "View All Departments":
            db.query(`SELECT d.id AS Department_Id, d.name AS Name FROM Department d`, (err, rows) =>{
                if (err){
                    throw(err)
                }
                console.table(rows);
            });
            startUp();
            break;
        case "View All Roles":
            db.query(`SELECT r.title AS Title, r.id AS Role_Id, d.name AS Department, r.salary AS Salary 
            FROM Role r
            LEFT JOIN Department d ON r.department_id = d.id`, (err, rows) => {
                if (err){
                    throw(err)
                }
                console.table(rows);
            });
            startUp();
            break;
        case "Add Employee":
            addEmployee()
            break;
        case "Add Department":
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'DepADD',
                    message: "What is the name of the Department?"
                }
            ]).then(answer => {
                db.query(`INSERT INTO Department (name) VALUES ('${answer.DepADD}')`, (err, rows) => {
                    if(err){
                        throw(err)
                    }
                })
            })
            startUp();
            break;
        case "Add Role":
            let depDisplay = depLook()
            inquirer.prompt([
                {
                    type: 'input',
                    name: "titleADD",
                    message: "What is the title of the new Role?"
                },
                {
                    type: 'input',
                    name: 'salaryADD',
                    message: 'What is the Salary of this role?'
                },
                {
                    type: 'list',
                    name: 'departADD',
                    message: 'Which Department is this Role in?',
                    choices: depDisplay
                }
            ]).then(answer => {
                db.query(`SELECT * FROM Department WHERE name = "${answer.departADD}"`, (err, res) => {
                    if (err){
                        throw (err);
                    }
                    let dep_id = res[0].id
                db.query(`INSERT INTO Role (title, salary, department_id) VALUES ('${answer.titleADD}', ${answer.salaryADD}, ${dep_id})`, (err, rows) => {
                    if(err){
                        throw(err)
                    }
                })
            })
            })
            setTimeout(function(){
                promptUser();
            }, 10000);
        
        break;
        case "Remove Employee":
            removeEmploy();
            break;
        case "Update Employee Role":
            let look = roleLook()
            let employees = employLook();
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updEmploy',
                    message: 'Which Employee would you like to update? ',
                    choices: employees

                },
                {
                    type: 'list',
                    name: 'updRole',
                    message: 'What is the new role?',
                    choices: look
                }
            ]).then(employee => {
                let role_id = 0;
                db.query(`SELECT id FROM employee WHERE concat(first_name, " ", last_name) = ${employe.updEmploy}`, (err, rows) => {
                    if (err) {
                        throw (err);
                    }
                    role_id = rows[0].id
                })
                db.query(`UPDATE employee SET role_id = ${role_id} WHERE concat(first_name, " ", last_name) = '${employee.updEmploy}'`, (err, result) => {
                    if (err) {
                        throw(err)
                    }
                })
            })
            
        
            break;
        }
        
        


}
const startUp = () =>{
    setTimeout(function(){
        promptUser();
    }, 4000);
}
//Creates list of departments from DB
const depLook = () => {
    let department = [];
    db.query(`SELECT * FROM Department`, (err, res) => {
        if (err){
            throw (err);
        }
        for (let i = 0; i < res.length; i++){
            department.push(res[i].name)
        }
    })
    return department;
}
//Creates List of Employees from DB
const employLook = () => {
    let employees = [];
    db.query(`SELECT concat(first_name, " ", last_name) AS name FROM employee`, (err, res) => {
        if (err){
            throw(err)
        }
        for (let i = 0; i < res.length; i++){
            employees.push(res[i].name)
        }
    })

    return employees;

}
//Creates List of Roles from DB
const roleLook = () => {
    const roleDisplay = []
    db.query(`SELECT * FROM Role`, (err, res) =>{
        if(err){
            throw(err)
        }
        for (let i = 0; i<res.length; i++){
            roleDisplay.push(res[i].title)
        }
    })
    return roleDisplay;

}

//Adds Employee
const addEmployee = () => {
    let roles = roleLook()
    let empDisplay = employLook()
    
     inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the fist name of the Employee?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the last name of the Employee?"
        },
        {
            type: 'list',
            name: 'emRole',
            message: "What is the role of the Employee?",
            choices: roles

        },
        {
            type: 'list',
            name: 'emMan',
            message: "Who is the Employee's manager?",
            choices: empDisplay
        }

    ]).then(answers =>{
        let manager_id = 0;
        let role_id = 0;
        db.query(`SELECT id FROM employee WHERE concat(first_name, " ", last_name) = "${answers.emMan}"`, (err, res) => {
            if (err) {
                throw(err)
            }
           manager_id = res[0].id
           db.query(`SELECT id FROM Role WHERE title="${answers.emRole}"`, (err, result) => {
               if (err){
                   throw err;
               }
               console.log(result[0].id)
               role_id = result[0].id;
               db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${role_id}, ${manager_id})`, (err, resl) => {
                        if (err) {
                            throw err;
                        }

                   })
           })
        
        })
       
    })
    setTimeout(function(){
        promptUser();
    }, 10000);

    
 }

 //Removes Employees
 const removeEmploy = () => {
    let empDisplay = employLook()
            inquirer.prompt([
                {
                type: 'list',
                name: 'delEmploy',
                message: 'What is the name of the Employee you would like to delete?',
                choices: empDisplay
                }

            ])
             .then(answer => {
            //     db.query(`DELETE FROM employee WHERE concat(first_name, " ", last_name) = '${answer.delEmploy}'`)
            console.log(answer)
         })

}


promptUser()