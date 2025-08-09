/*
  Warnings:

  - Added the required column `leagueName` to the `teamSeasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seasons` ADD COLUMN `current` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `teamSeasons` ADD COLUMN `leagueName` VARCHAR(191) NOT NULL,
    MODIFY `teamLeaderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teams` ADD COLUMN `category` ENUM('Men', 'Women', 'Youth') NOT NULL,
    ADD COLUMN `orderNumber` INTEGER NOT NULL;
