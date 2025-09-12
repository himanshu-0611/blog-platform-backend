/*
  Warnings:

  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `created_on` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_on` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "created_on" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD COLUMN     "updated_on" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_id_seq";

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
