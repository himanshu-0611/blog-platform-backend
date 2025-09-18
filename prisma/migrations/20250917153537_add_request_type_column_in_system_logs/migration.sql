/*
  Warnings:

  - Added the required column `request_type` to the `system_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."system_logs" ADD COLUMN     "request_type" TEXT NOT NULL;
