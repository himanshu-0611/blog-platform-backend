/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "is_archive" BOOLEAN NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");
