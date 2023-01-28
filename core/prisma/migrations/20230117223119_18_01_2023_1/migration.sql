-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('CFD', 'OPTION', 'STOCK');

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TradeType" DEFAULT 'CFD',
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "pair" TEXT NOT NULL DEFAULT 'BTC/USD',
    "leverageRatio" INTEGER NOT NULL DEFAULT 1,
    "marginSize" DOUBLE PRECISION,
    "leverageSize" DOUBLE PRECISION,
    "tradeSize" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "priceOpened" DOUBLE PRECISION NOT NULL,
    "priceClosed" DOUBLE PRECISION,
    "overnightInterest" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "overnightFee" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "Trade_id_key" ON "Trade"("id");
