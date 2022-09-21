/*
  Warnings:

  - You are about to drop the column `basePrice` on the `BaseWeapon` table. All the data in the column will be lost.
  - Added the required column `basePriceMul` to the `BaseWeapon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BaseWeapon" DROP COLUMN "basePrice",
ADD COLUMN     "basePriceMul" DOUBLE PRECISION NOT NULL;
