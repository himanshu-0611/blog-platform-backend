-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "role_name" VARCHAR(255) NOT NULL,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scopes" (
    "id" TEXT NOT NULL,
    "module" VARCHAR(255) NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "scope_text" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "scopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles_scopes" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "roles_scopes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."roles_scopes" ADD CONSTRAINT "roles_scopes_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roles_scopes" ADD CONSTRAINT "roles_scopes_scope_id_fkey" FOREIGN KEY ("scope_id") REFERENCES "public"."scopes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
