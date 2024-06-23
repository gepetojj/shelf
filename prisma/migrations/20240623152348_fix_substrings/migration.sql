/*
  Warnings:

  - Changed the type of `substrings` on the `Annotation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Annotation" DROP COLUMN "substrings",
ADD COLUMN     "substrings" JSONB NOT NULL;
