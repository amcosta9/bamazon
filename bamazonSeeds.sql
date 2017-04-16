USE bamazon;

CREATE TABLE products(
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NULL,
  `department_name` VARCHAR(45) NULL,
  `price` INT(11) NULL,
  `stock_quantity` INT(11) NULL,
  PRIMARY KEY (id)
);

INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Pusheen Plush", "Toys", 21, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Wustof Classic Ikon 8-in Knife", "Kitchen", 159, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Himalayan Salt Lamp", "Home", 9, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Aromatherapy Essential Oil Diffuser", "Home", 24, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Star Wars Yoda Lego Mini-Figure", "Toys", 4, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Dinosaur Soup Ladle", "Kitchen", 10, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Luxury Cat Lounge", "Home", 50, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Batman Funko POP", "Toys", 9, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Chambray Bib Apron", "Kitchen", 72, 15);
INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Nesting Food Prep Bowls", "Kitchen", 26, 15);
