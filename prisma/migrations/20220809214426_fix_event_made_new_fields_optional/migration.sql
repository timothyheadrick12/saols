-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_marketId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "encounterId" DROP NOT NULL,
ALTER COLUMN "marketId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
