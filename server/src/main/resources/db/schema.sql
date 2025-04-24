CREATE TABLE `user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `email_verified` BOOL NOT NULL DEFAULT FALSE,
    `enabled` BOOL NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `category` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

CREATE TABLE `product` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `description` TEXT,
    `price` INT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `sold` BOOL NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
);

CREATE TABLE `image` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `product_image` (
    `product_id` INT UNSIGNED NOT NULL,
    `image_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`product_id`, `image_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`image_id`) REFERENCES `image` (`id`) ON DELETE CASCADE
);

INSERT INTO `category` (`name`)
VALUES
    ('Others'),
    ('Textbooks & Study Materials'),
    ('Electronics'),
    ('Clothing & Uniforms'),
    ('Dorm & Room Essentials'),
    ('Bikes & Transportation'),
    ('Hobby & Leisure'),
    ('Lost & Found'),
    ('Free Items / Giveaways');