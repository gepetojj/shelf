-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_postId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_postId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnPosts" DROP CONSTRAINT "TagsOnPosts_tagId_fkey";

-- AlterTable
ALTER TABLE "Annotation" ALTER COLUMN "ownerId" SET DEFAULT 'deleted';

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "ownerId" SET DEFAULT 'deleted';

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "uploaderId" SET DEFAULT 'deleted';

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "uploaderId" SET DEFAULT 'deleted';

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_workIdentifier_title_idx" ON "Post"("workIdentifier", "title");

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TagsOnPosts" ADD CONSTRAINT "TagsOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPosts" ADD CONSTRAINT "TagsOnPosts_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
