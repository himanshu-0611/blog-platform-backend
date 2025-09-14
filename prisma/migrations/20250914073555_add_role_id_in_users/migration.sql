-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
