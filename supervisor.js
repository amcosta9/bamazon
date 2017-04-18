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
};

var createDept = function() {
    console.log('Create New Department');
};