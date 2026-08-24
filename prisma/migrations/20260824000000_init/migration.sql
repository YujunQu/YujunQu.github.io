CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VISITOR');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'VISITOR',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

CREATE TABLE "antibody_records" (
  "id" TEXT NOT NULL,
  "species" TEXT NOT NULL,
  "sample" TEXT NOT NULL,
  "target" TEXT NOT NULL,
  "dye" TEXT NOT NULL,
  "clone" TEXT,
  "product_name" TEXT NOT NULL,
  "catalog_no" TEXT NOT NULL,
  "concentration" TEXT,
  "vendor" TEXT,
  "vendor_dose" TEXT,
  "system" TEXT,
  "stain_condition" TEXT,
  "optimal_dose" TEXT,
  "minimum_dose" TEXT,
  "titration_result" TEXT,
  "image_path" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "antibody_records_pkey" PRIMARY KEY ("id")
);
