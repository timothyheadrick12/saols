/*
  Warnings:

  - You are about to drop the `BattlePrompts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketPrompts` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "started" SET DEFAULT false,
ALTER COLUMN "finished" SET DEFAULT false,
ALTER COLUMN "random" SET DEFAULT false;

-- DropTable
DROP TABLE "BattlePrompts";

-- DropTable
DROP TABLE "MarketPrompts";

-- CreateTable
CREATE TABLE "BattlePrompt" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "BattlePrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrompt" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MarketPrompt_pkey" PRIMARY KEY ("id")
);
