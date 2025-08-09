/*
  Warnings:

  - You are about to drop the column `isCaptain` on the `teamMembers` table. All the data in the column will be lost.
  - You are about to drop the `_SeasonToTeam` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `eventCategories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `organisations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_SeasonToTeam` DROP FOREIGN KEY `_SeasonToTeam_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SeasonToTeam` DROP FOREIGN KEY `_SeasonToTeam_B_fkey`;

-- AlterTable
ALTER TABLE `teamMembers` DROP COLUMN `isCaptain`;

-- DropTable
DROP TABLE `_SeasonToTeam`;

-- CreateTable
CREATE TABLE `teamSeasons` (
    `teamId` INTEGER NOT NULL,
    `seasonId` INTEGER NOT NULL,
    `teamLeaderId` VARCHAR(191) NOT NULL,
    `nuGroupId` VARCHAR(191) NOT NULL,
    `nuTeamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`teamId`, `seasonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `eventCategories_slug_key` ON `eventCategories`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `organisations_slug_key` ON `organisations`(`slug`);

-- AddForeignKey
ALTER TABLE `teamSeasons` ADD CONSTRAINT `teamSeasons_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamSeasons` ADD CONSTRAINT `teamSeasons_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamSeasons` ADD CONSTRAINT `teamSeasons_teamLeaderId_fkey` FOREIGN KEY (`teamLeaderId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
