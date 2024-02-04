-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('AED', 'USD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookinngs" (
    "id" TEXT NOT NULL,
    "bookingId" INTEGER,
    "propertyId" INTEGER,
    "propertyName" TEXT NOT NULL,
    "propertyImageUrl" TEXT NOT NULL,
    "arrivalDate" DATE NOT NULL,
    "departureDate" DATE NOT NULL,
    "totalGuests" INTEGER NOT NULL,
    "totalBill" DECIMAL(8,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'AED',
    "address" TEXT NOT NULL,
    "beds" SMALLINT NOT NULL,
    "baths" SMALLINT NOT NULL,
    "rooms" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bookinngs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bookinngs" ADD CONSTRAINT "bookinngs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
