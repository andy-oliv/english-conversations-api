-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(512) NULL,
    `currentLevel` ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL DEFAULT 'A1',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
