/*
  Warnings:

  - Added the required column `socialCreationDate` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "socialCreationDate" TIMESTAMP(3) NOT NULL;
