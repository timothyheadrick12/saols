/*
  Warnings:

  - Added the required column `atm` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handlingRequirement` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lvl` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numHits` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spdCost` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weaponType` to the `SwordSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseWeaponId` to the `Weapon` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('ONE_HANDED_SWORD', 'ONE_HANDED_CURVED_SWORD', 'ONE_HANDED_AXE', 'TWO_HANDED_BATTLE_AXE', 'TWO_HANDED_SWORD', 'RAPIER', 'DAGGER', 'CLAWS', 'KATANA', 'MACE', 'SPEAR');

-- AlterTable
ALTER TABLE "SwordSkill" ADD COLUMN     "atm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "handlingRequirement" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lvl" INTEGER NOT NULL,
ADD COLUMN     "numHits" INTEGER NOT NULL,
ADD COLUMN     "spdCost" INTEGER NOT NULL,
ADD COLUMN     "weaponType" "WeaponType" NOT NULL;

-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "baseWeaponId" INTEGER NOT NULL,
ALTER COLUMN "lvl" DROP DEFAULT;

-- CreateTable
CREATE TABLE "BaseWeapon" (
    "id" SERIAL NOT NULL,
    "type" "WeaponType" NOT NULL,
    "name" TEXT NOT NULL,
    "minLvl" INTEGER NOT NULL DEFAULT 1,
    "baseWeight" INTEGER NOT NULL,
    "baseAtk" INTEGER NOT NULL,
    "basicAtkSpdCost" INTEGER NOT NULL,
    "damagePerLvl" DOUBLE PRECISION NOT NULL,
    "basePrice" INTEGER NOT NULL,

    CONSTRAINT "BaseWeapon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_baseWeaponId_fkey" FOREIGN KEY ("baseWeaponId") REFERENCES "BaseWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
