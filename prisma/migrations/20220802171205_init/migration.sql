-- CreateEnum
CREATE TYPE "TweetType" AS ENUM ('ENCOUNTER', 'MARKET', 'BOSS', 'MESSAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lvl" INTEGER NOT NULL DEFAULT 1,
    "str" INTEGER NOT NULL DEFAULT 1,
    "agi" INTEGER NOT NULL DEFAULT 1,
    "cor" INTEGER NOT NULL DEFAULT 100,
    "weaponId" INTEGER NOT NULL,
    "betaTester" BOOLEAN NOT NULL DEFAULT true,
    "beater" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "lvl" INTEGER NOT NULL,
    "atk" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwordSkill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "power" INTEGER NOT NULL,

    CONSTRAINT "SwordSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "type" "TweetType" NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SwordSkillToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToUser_AB_unique" ON "_ItemToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToUser_B_index" ON "_ItemToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SwordSkillToUser_AB_unique" ON "_SwordSkillToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SwordSkillToUser_B_index" ON "_SwordSkillToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SwordSkillToUser" ADD CONSTRAINT "_SwordSkillToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "SwordSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SwordSkillToUser" ADD CONSTRAINT "_SwordSkillToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
