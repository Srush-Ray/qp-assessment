CREATE TABLE `pricing` (
  `ID` varchar(45) NOT NULL,
  `price` int DEFAULT 0,
  `weight` int DEFAULT 0,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `items` (
    `ID` varchar(45) NOT NULL,
    `pricing_id` varchar(45) NOT NULL,
    `item_name` varchar(255) NOT NULL,
    `available_quantity` int NOT NULL DEFAULT 0,
    `item_weight_unit` varchar(50) NOT NULL DEFAULT 'count',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`pricing_id`) REFERENCES pricing(`ID`)
);

CREATE TABLE `orders` (
    `ID` varchar(45) NOT NULL,
    `address` varchar(255) NOT NULL,
    `pincode` varchar(10) NOT NULL,
    `total_amount` int DEFAULT 0,
    `total_items` int DEFAULT 0,
    `mobile_number`  varchar(15) NOT NULL,
    `customer_name` varchar(255) NOT NULL,
    PRIMARY KEY (`ID`)
);


CREATE TABLE `order_items` (
    `ID` varchar(45) NOT NULL,
    `item_id` varchar(45) NOT NULL,
    `order_id` varchar(255) NOT NULL,
    `price` int NOT NULL DEFAULT 0,
    `quantity` int NOT NULL DEFAULT 0,
    `total_price` int NOT NULL DEFAULT 0,
    `weight` int DEFAULT 0,
    `total_weight` int DEFAULT 0,
    `item_weight_unit` varchar(50) NOT NULL DEFAULT 'count',
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`order_id`) REFERENCES orders(`ID`)
);
