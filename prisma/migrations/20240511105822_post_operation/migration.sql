/*
  Warnings:

  - You are about to drop the column `comment` on the `PostOperation` table. All the data in the column will be lost.
  - You are about to drop the column `reaction` on the `PostOperation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostOperation" DROP COLUMN "comment",
DROP COLUMN "reaction",
ADD COLUMN     "commentId" UUID,
ADD COLUMN     "reactionId" UUID;

-- AddForeignKey
ALTER TABLE "PostOperation" ADD CONSTRAINT "PostOperation_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostOperation" ADD CONSTRAINT "PostOperation_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "TopicMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
