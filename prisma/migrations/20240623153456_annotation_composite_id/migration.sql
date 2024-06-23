/*
  Warnings:

  - The primary key for the `Annotation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Annotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Annotation_pkey" PRIMARY KEY ("ownerId", "postId", "page", "textContent");
