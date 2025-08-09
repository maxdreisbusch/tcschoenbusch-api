-- CreateTable
CREATE TABLE `controlInterfaces` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `preBooking` INTEGER NOT NULL,
    `postBooking` INTEGER NOT NULL,
    `connectByAnd` BOOLEAN NOT NULL DEFAULT false,
    `connectByOr` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ControlInterfaceToCourt` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ControlInterfaceToCourt_AB_unique`(`A`, `B`),
    INDEX `_ControlInterfaceToCourt_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ControlInterfaceToCourt` ADD CONSTRAINT `_ControlInterfaceToCourt_A_fkey` FOREIGN KEY (`A`) REFERENCES `controlInterfaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ControlInterfaceToCourt` ADD CONSTRAINT `_ControlInterfaceToCourt_B_fkey` FOREIGN KEY (`B`) REFERENCES `courts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
