-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moderator" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PermanentRule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "tweetStreamRuleId" TEXT,

    CONSTRAINT "PermanentRule_pkey" PRIMARY KEY ("id")
);
