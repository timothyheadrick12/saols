/*
  Warnings:

  - Made the column `hashtag` on table `PermanentRule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PermanentRule" ALTER COLUMN "hashtag" SET NOT NULL;
