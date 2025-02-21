/*
  Warnings:

  - Added the required column `birthdate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `birthdate` DATE NOT NULL,
    MODIFY `currentLevel` ENUM('A1', 'A2', 'B1', 'B2', 'C1') NULL DEFAULT 'A1',
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
