/*
  Warnings:

  - You are about to alter the column `price` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `taxRate` DOUBLE NULL,
    MODIFY `price` DOUBLE NULL;
