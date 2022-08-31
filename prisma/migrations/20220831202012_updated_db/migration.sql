/*
  Warnings:

  - Added the required column `hp` to the `Enemy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hpc` to the `Enemy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Enemy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "enemyTitles" AS ENUM ('WEAK', 'NORMAL', 'STRONG', 'MENACING', 'NIGHTMARE');

-- AlterTable
ALTER TABLE "Enemy" ADD COLUMN     "hp" INTEGER NOT NULL,
ADD COLUMN     "hpc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "title" "enemyTitles" NOT NULL,
ADD COLUMN     "weaponId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avenger" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "clearer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hero" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "merchant" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Enemy" ADD CONSTRAINT "Enemy_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
