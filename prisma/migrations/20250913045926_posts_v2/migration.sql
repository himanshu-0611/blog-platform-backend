/*
  Warnings:

  - Made the column `created_by` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."posts" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "updated_on" DROP NOT NULL;
