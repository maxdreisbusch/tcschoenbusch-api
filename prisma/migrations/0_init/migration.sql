-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `auth0Id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `cityCode` VARCHAR(191) NULL,
    `cityName` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_auth0Id_key`(`auth0Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verificationTokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verificationTokens_token_key`(`token`),
    UNIQUE INDEX `verificationTokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `activeFrom` DATETIME(3) NULL,
    `activeTo` DATETIME(3) NULL,
    `bookableFrom` DATETIME(3) NULL,
    `order` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `activeFrom` DATETIME(3) NULL,
    `activeTo` DATETIME(3) NULL,
    `areaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `courtId` VARCHAR(191) NULL,
    `status` ENUM('REQUESTED', 'BILLED', 'APPROVED') NOT NULL,
    `type` ENUM('TOURNAMENT', 'MAINTENANCE', 'TEAM_PRACTICE', 'TEAM_COMPETITION') NULL,
    `light` BOOLEAN NOT NULL,
    `radiator` BOOLEAN NOT NULL,
    `abonnementId` VARCHAR(191) NULL,
    `ownerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservationRule` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `errorDescription` VARCHAR(191) NULL,
    `checkOn` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `ruleCheckPluginName` VARCHAR(191) NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `abonnements` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `weekday` INTEGER NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `duration` DOUBLE NOT NULL,
    `status` ENUM('REQUESTED', 'APPROVED', 'BILLED', 'PAID', 'DELETED') NOT NULL,
    `courtId` VARCHAR(191) NULL,
    `ownerId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `router` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `userRoleId` INTEGER NOT NULL,
    `allowed` ENUM('NONE', 'OWN', 'ALL') NOT NULL DEFAULT 'NONE',

    PRIMARY KEY (`router`, `action`, `userRoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hallencards` (
    `code` VARCHAR(191) NOT NULL,
    `pin` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `printed` BOOLEAN NOT NULL,
    `transactionId` VARCHAR(191) NULL,

    UNIQUE INDEX `hallencards_transactionId_key`(`transactionId`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices` (
    `id` VARCHAR(191) NOT NULL,
    `validFrom` DATETIME(3) NULL,
    `validTo` DATETIME(3) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `mon` BOOLEAN NOT NULL DEFAULT false,
    `tue` BOOLEAN NOT NULL DEFAULT false,
    `wed` BOOLEAN NOT NULL DEFAULT false,
    `thu` BOOLEAN NOT NULL DEFAULT false,
    `fri` BOOLEAN NOT NULL DEFAULT false,
    `sat` BOOLEAN NOT NULL DEFAULT false,
    `sun` BOOLEAN NOT NULL DEFAULT false,
    `from` INTEGER NOT NULL,
    `to` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'EUR',
    `taxes` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `value` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `reason` ENUM('HALLENCARD_RECHARGE', 'INVOICE', 'ONLINE_PAYMENT', 'BANK_TRANSFER', 'COURT_RESERVATION', 'COURT_RESERVATION_STORNO', 'REFUND', 'DONATION') NOT NULL,
    `paymentInformation` VARCHAR(191) NULL,
    `reservationId` VARCHAR(191) NULL,
    `abonnementId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `starting` DATETIME(3) NOT NULL,
    `ending` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teamMembers` (
    `userId` VARCHAR(191) NOT NULL,
    `teamId` INTEGER NOT NULL,
    `seasonId` INTEGER NOT NULL,
    `isCaptain` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`userId`, `teamId`, `seasonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `severity` ENUM('ERROR', 'WARNING', 'INFO', 'SUCCESS') NOT NULL,
    `showFrom` DATETIME(3) NOT NULL,
    `showTo` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToUserRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserToUserRole_AB_unique`(`A`, `B`),
    INDEX `_UserToUserRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AreaToReservationRule` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AreaToReservationRule_AB_unique`(`A`, `B`),
    INDEX `_AreaToReservationRule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AreaToPrice` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AreaToPrice_AB_unique`(`A`, `B`),
    INDEX `_AreaToPrice_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourtToReservationRule` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourtToReservationRule_AB_unique`(`A`, `B`),
    INDEX `_CourtToReservationRule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_reservationFellows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_reservationFellows_AB_unique`(`A`, `B`),
    INDEX `_reservationFellows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ReservationRuleToUserRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ReservationRuleToUserRole_AB_unique`(`A`, `B`),
    INDEX `_ReservationRuleToUserRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PriceToUserRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PriceToUserRole_AB_unique`(`A`, `B`),
    INDEX `_PriceToUserRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SeasonToTeam` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SeasonToTeam_AB_unique`(`A`, `B`),
    INDEX `_SeasonToTeam_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courts` ADD CONSTRAINT `courts_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `areas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_courtId_fkey` FOREIGN KEY (`courtId`) REFERENCES `courts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_abonnementId_fkey` FOREIGN KEY (`abonnementId`) REFERENCES `abonnements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `abonnements` ADD CONSTRAINT `abonnements_courtId_fkey` FOREIGN KEY (`courtId`) REFERENCES `courts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `abonnements` ADD CONSTRAINT `abonnements_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_userRoleId_fkey` FOREIGN KEY (`userRoleId`) REFERENCES `userRoles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hallencards` ADD CONSTRAINT `hallencards_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `reservations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_abonnementId_fkey` FOREIGN KEY (`abonnementId`) REFERENCES `abonnements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamMembers` ADD CONSTRAINT `teamMembers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamMembers` ADD CONSTRAINT `teamMembers_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamMembers` ADD CONSTRAINT `teamMembers_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToUserRole` ADD CONSTRAINT `_UserToUserRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToUserRole` ADD CONSTRAINT `_UserToUserRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `userRoles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToReservationRule` ADD CONSTRAINT `_AreaToReservationRule_A_fkey` FOREIGN KEY (`A`) REFERENCES `areas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToReservationRule` ADD CONSTRAINT `_AreaToReservationRule_B_fkey` FOREIGN KEY (`B`) REFERENCES `ReservationRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToPrice` ADD CONSTRAINT `_AreaToPrice_A_fkey` FOREIGN KEY (`A`) REFERENCES `areas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToPrice` ADD CONSTRAINT `_AreaToPrice_B_fkey` FOREIGN KEY (`B`) REFERENCES `prices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourtToReservationRule` ADD CONSTRAINT `_CourtToReservationRule_A_fkey` FOREIGN KEY (`A`) REFERENCES `courts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourtToReservationRule` ADD CONSTRAINT `_CourtToReservationRule_B_fkey` FOREIGN KEY (`B`) REFERENCES `ReservationRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_reservationFellows` ADD CONSTRAINT `_reservationFellows_A_fkey` FOREIGN KEY (`A`) REFERENCES `reservations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_reservationFellows` ADD CONSTRAINT `_reservationFellows_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReservationRuleToUserRole` ADD CONSTRAINT `_ReservationRuleToUserRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `ReservationRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReservationRuleToUserRole` ADD CONSTRAINT `_ReservationRuleToUserRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `userRoles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PriceToUserRole` ADD CONSTRAINT `_PriceToUserRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `prices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PriceToUserRole` ADD CONSTRAINT `_PriceToUserRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `userRoles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SeasonToTeam` ADD CONSTRAINT `_SeasonToTeam_A_fkey` FOREIGN KEY (`A`) REFERENCES `seasons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SeasonToTeam` ADD CONSTRAINT `_SeasonToTeam_B_fkey` FOREIGN KEY (`B`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

