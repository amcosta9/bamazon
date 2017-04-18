USE bamazon;

CREATE TABLE `departments`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(45) NULL,
  `over_head_costs` INT(11) NULL DEFAULT 0,
  `total_sales` INT(11) NULL DEFAULT 0,
  PRIMARY KEY (id)
);

ALTER TABLE `products`
ADD product_sales INT(11) NULL DEFAULT 0;

INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Kitchen", 3500);
INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Toys", 1750);
INSERT INTO `departments` (`department_name`, `over_head_costs`)
VALUES ("Home", 2386);