-- CreateTable
CREATE TABLE "public"."system_logs" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "request_headers" TEXT NOT NULL,
    "request_body" TEXT NOT NULL,
    "response_headers" TEXT NOT NULL,
    "response_body" TEXT NOT NULL,
    "is_errorenous" BOOLEAN NOT NULL DEFAULT false,
    "exception" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);
