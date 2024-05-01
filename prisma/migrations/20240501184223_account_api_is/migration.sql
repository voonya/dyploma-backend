/*
  Warnings:

  - Added the required column `apiHash` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "apiHash" TEXT NOT NULL,
ADD COLUMN     "apiId" INTEGER NOT NULL;
