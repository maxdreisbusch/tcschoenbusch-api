-- CreateTable
CREATE TABLE `pushNotificationChannels` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpoPushTokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PushNotification` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_userRolePushNotificationChannels` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userRolePushNotificationChannels_AB_unique`(`A`, `B`),
    INDEX `_userRolePushNotificationChannels_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_expoPushTokenChannels` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_expoPushTokenChannels_AB_unique`(`A`, `B`),
    INDEX `_expoPushTokenChannels_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExpoPushTokens` ADD CONSTRAINT `ExpoPushTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PushNotification` ADD CONSTRAINT `PushNotification_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `pushNotificationChannels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRolePushNotificationChannels` ADD CONSTRAINT `_userRolePushNotificationChannels_A_fkey` FOREIGN KEY (`A`) REFERENCES `pushNotificationChannels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userRolePushNotificationChannels` ADD CONSTRAINT `_userRolePushNotificationChannels_B_fkey` FOREIGN KEY (`B`) REFERENCES `userRoles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_expoPushTokenChannels` ADD CONSTRAINT `_expoPushTokenChannels_A_fkey` FOREIGN KEY (`A`) REFERENCES `ExpoPushTokens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_expoPushTokenChannels` ADD CONSTRAINT `_expoPushTokenChannels_B_fkey` FOREIGN KEY (`B`) REFERENCES `pushNotificationChannels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
