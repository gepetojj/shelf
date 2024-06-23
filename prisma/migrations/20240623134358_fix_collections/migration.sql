/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_collectionId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "CollectionsOnPosts" (
    "collectionId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "CollectionsOnPosts_pkey" PRIMARY KEY ("collectionId","postId")
);

-- AddForeignKey
ALTER TABLE "CollectionsOnPosts" ADD CONSTRAINT "CollectionsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionsOnPosts" ADD CONSTRAINT "CollectionsOnPosts_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
