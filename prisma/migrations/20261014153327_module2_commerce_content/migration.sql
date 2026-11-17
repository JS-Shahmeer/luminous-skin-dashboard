-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `notes` TEXT NULL;

-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `fileUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `stripeSessionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_stripeSessionId_key` ON `Order`(`stripeSessionId`);
