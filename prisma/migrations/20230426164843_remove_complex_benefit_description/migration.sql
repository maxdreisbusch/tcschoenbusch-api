/*
  Warnings:

  - You are about to drop the `benefitDescriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `benefitDescriptions` DROP FOREIGN KEY `benefitDescriptions_benefitId_fkey`;

-- AlterTable
ALTER TABLE `benefits` ADD COLUMN `description` TEXT NULL;

-- DropTable
DROP TABLE `benefitDescriptions`;
