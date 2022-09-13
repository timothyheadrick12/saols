/*
  Warnings:

  - A unique constraint covering the columns `[encounterId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clawsSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "daggerSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "katanaSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maceSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "oneHandedAxeSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "oneHandedCurvedSwordSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "oneHandedSwordSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rapierSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spearSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twoHandedBattleAxeSkillExp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twoHandedSwordSkillExp" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Event_encounterId_key" ON "Event"("encounterId");
