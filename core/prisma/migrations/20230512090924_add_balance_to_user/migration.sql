-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "isLong" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 10000;
