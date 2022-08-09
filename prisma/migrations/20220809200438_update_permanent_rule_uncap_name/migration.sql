/*
  Warnings:

  - You are about to drop the column `Name` on the `PermanentRule` table. All the data in the column will be lost.
  - Added the required column `name` to the `PermanentRule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PermanentRule" DROP COLUMN "Name",
ADD COLUMN     "name" TEXT NOT NULL;
