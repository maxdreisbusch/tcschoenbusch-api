-- AlterTable
ALTER TABLE `users` ADD COLUMN `needsSetup` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `publicName` BOOLEAN NOT NULL DEFAULT true;
