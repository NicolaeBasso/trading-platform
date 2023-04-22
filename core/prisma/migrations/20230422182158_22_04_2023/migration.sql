/*
  Warnings:

  - The values [STOCK] on the enum `TradeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "TradeType_new" AS ENUM ('CFD', 'OPTIONS', 'STOCKS');
ALTER TABLE "Trade" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Trade" ALTER COLUMN "type" TYPE "TradeType_new" USING ("type"::text::"TradeType_new");
ALTER TYPE "TradeType" RENAME TO "TradeType_old";
ALTER TYPE "TradeType_new" RENAME TO "TradeType";
DROP TYPE "TradeType_old";
ALTER TABLE "Trade" ALTER COLUMN "type" SET DEFAULT 'CFD';
COMMIT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" "Role" DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
