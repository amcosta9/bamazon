/**
 * Created by Ariel on 4/15/2017.
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
    console.log('Welcome to Bamazon! You\'re connected as id ' + connection.threadId + '. Here\'s what we have in stock:');
    showProducts();
});

// queries products table and displays in cli-table
var showProducts = function () {
    var showProdQuery = 'SELECT * FROM `products`';
    connection.query(showProdQuery, function (err, res) {
        if (err) throw err;

        // initializes new cli-table
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price']
            , colWidths: [13, 35, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].price]
            );
        }

        console.log(table.toString());

        buyProduct();
    });
};

var buyProduct = function () {
    // ask user what product and how many they would like to buy
    inquirer.prompt([
        {
            type: 'input',
            name: 'productId',
            message: 'What would you like to buy? (enter product ID number)',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        }
    ]).then(function (answer) {
        console.log(answer);
        // check to see if inventory of selected product is available
        var invQuery = 'SELECT * FROM `products` WHERE ? AND `stock_quantity` >= ?';
        connection.query(invQuery, [{id: answer.productId}, answer.quantity], function (err, res) {
            if (err) throw err;
            console.log(res.length);
            if (res.length > 0) {
                purchase(res, answer.quantity);
            } else {
                console.log('Sorry, we do not have enough inventory to cover your order');
                showProducts();
            }
        });


    });
};

var purchase = function (bamItem, userQuant) {
    console.log('purchase function', bamItem);
    console.log('userQuant', userQuant);
    // subtract amount purchased from stock quantity
    var newQuant = bamItem[0].stock_quantity - userQuant;
    console.log('bamItem', bamItem[0].stock_quantity);
    console.log('newQuant', newQuant);
    // update database table `products`
    connection.query("UPDATE `products` SET ? WHERE ?", [
        {
            stock_quantity: newQuant
        },
        {
            id: bamItem[0].id
        }
    ], function (err, res) {
        if (err) throw err;
        console.log(res);
    });
    // end server connection
    connection.end();
};

