/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mobile" VARCHAR(15) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");
