/**
 * Created by Ariel on 4/17/2017.
 */
var inquirer = require('inquirer'),
    Table = require('cli-table'),
    mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'root',
    database: 'bamazon'
});

// establishes connection with database and runs showProducts()
connection.connect(function (err) {
    if (err) throw err;
    console.log('Hello Supervisor! Welcome to work. You\'re connected as id ' + connection.threadId + '.');
    itsTheBigBoss();
});

var itsTheBigBoss = function() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department', 'Disconnect']
        }
    ]).then(function (data) {
        switch (data.toDo) {
            case 'View Product Sales by Department':
                salesByDept();
                break;
            case 'Create New Department':
                createDept();
                break;
            case 'Disconnect':
                console.log('Goodbye!');
                connection.end();
                break;
            default:
                console.log('Something went wrong.')
        } // end switch()
    }); // end .then()
}; // end itsTheBigBoss()

var salesByDept = function() {
    console.log('Product Sales by Department');
    var allQuery = 'SELECT * FROM `departments`';
    connection.query(allQuery, function (err, res) {
        if (err) throw err;

        // initializes new cli-table
        var table = new Table({
            head: ['Dept ID', 'Department Name', 'Overhead Costs', 'Total Sales', 'Total Profit']
            , colWidths: [13, 20, 16, 16, 16]
        });

        for (var i = 0; i < res.length; i++) {
            var profit = res[i].total_sales - res[i].over_head_costs;
            table.push(
                [res[i].id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, profit]
            );
        }

        console.log(table.toString());

        itsTheBigBoss();
    }); // end connection.query
};

var createDept = function() {
    console.log('Please Enter New Department Details');
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Department Name'
        },
        {
            type: 'input',
            name: 'overheadCosts',
            message: 'Overhead Costs',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO `departments` SET ?", {
            department_name: answer.departmentName,
            over_head_costs: answer.overheadCosts,
            total_sales: 0
        }, function (err, res) {
            console.log('New department added. Run the Manager Dashboard to at products to this department.');
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'doNext',
                    message: 'What would you like to do?',
                    choices: ['Add Another Department', 'Main Menu', 'Disconnect']
                }
            ]).then(function (data) {
                switch (data.doNext) {
                    // if user selects to continue shopping, display products
                    case 'Add Another Product':
                        createDept();
                        break;
                    case 'Main Menu':
                        itsTheBigBoss();
                        break;
                    case 'Disconnect':
                        console.log('Goodbye!');
                        // end server connection
                        connection.end();
                        break;
                    default:
                        console.log('something went wrong')
                } // end switch()
            }); // end .then() doNext
        }); // end connection.query insert to departments
    }); // end .then() new department inquirer prompt

};