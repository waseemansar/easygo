/*
  Warnings:

  - You are about to drop the `bookinngs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookinngs" DROP CONSTRAINT "bookinngs_userId_fkey";

-- DropTable
DROP TABLE "bookinngs";

-- CreateTable
CREATE TABLE "bookings" (
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

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
