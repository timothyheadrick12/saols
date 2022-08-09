/*
  Warnings:

  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tweet";

-- CreateTable
CREATE TABLE "Boss" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "health" INTEGER NOT NULL,

    CONSTRAINT "Boss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "tweetText" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "started" BOOLEAN NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "random" BOOLEAN NOT NULL,
    "bossId" INTEGER,
    "customHashtag" TEXT,
    "type" "TweetType" NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_bossId_key" ON "Event"("bossId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "Boss"("id") ON DELETE SET NULL ON UPDATE CASCADE;
