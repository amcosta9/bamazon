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
            , colWidths: [13, 40, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].price]
            );
        }

        console.log(table.toString());

        buyProduct();
    }); // end connection.query
}; // end showProducts()

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
        // check to see if inventory of selected product is available
        var invQuery = 'SELECT * FROM `products` WHERE ? AND `stock_quantity` >= ?';
        connection.query(invQuery, [{id: answer.productId}, answer.quantity], function (err, res) {
            if (err) throw err;
            // if result of query is > 0, there is enough quantity available
            if (res.length > 0) {
                purchase(res, answer.quantity);
            } else {
                console.log('Sorry, we do not have enough inventory to cover your order.');
                showProducts();
            }
        }); // end connection.query


    }); // end .then
}; // end buyProduct()

var purchase = function (bamItem, userQuant) {
    // calculate user's total
    var total = (bamItem[0].price * userQuant);
    console.log('Great! Your order for ' + userQuant + ' ' + bamItem[0].product_name + ' is processing. Your total is: $' + total + '.');
    // subtract amount purchased from stock quantity
    var newQuant = bamItem[0].stock_quantity - userQuant;
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
        console.log('Thanks for your purchase!');
        inquirer.prompt([
            {
                type: 'list',
                name: 'doNext',
                message: 'What would you like to do?',
                choices: ['Continue Shopping', 'Disconnect']
            }
        ]).then(function (data) {
            switch (data.doNext) {
                // if user selects to continue shopping, display products
                case 'Continue Shopping':
                    console.log('Here\'s what we have in stock:');
                    showProducts();
                    break;
                case 'Disconnect':
                    console.log('Goodbye!');
                    // end server connection
                    connection.end();
                    break;
                default:
                    console.log('something went wrong')
            } // end switch()
        }); // end .then
    }); // end connection.query
}; // end purchase()

