-- CreateTable
CREATE TABLE "tb_role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tb_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_permission" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tb_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_role" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_role_permission" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_role_name_key" ON "tb_role"("name");

-- CreateIndex
CREATE INDEX "idx_tb_role_name" ON "tb_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_permission_name_key" ON "tb_permission"("name");

-- CreateIndex
CREATE INDEX "idx_tb_permission_name" ON "tb_permission"("name");

-- CreateIndex
CREATE INDEX "idx_tb_user_role_user_id" ON "tb_user_role"("user_id");

-- CreateIndex
CREATE INDEX "idx_tb_user_role_role_id" ON "tb_user_role"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_role_user_id_role_id_key" ON "tb_user_role"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "idx_tb_role_permission_role_id" ON "tb_role_permission"("role_id");

-- CreateIndex
CREATE INDEX "idx_tb_role_permission_permission_id" ON "tb_role_permission"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_role_permission_role_id_permission_id_key" ON "tb_role_permission"("role_id", "permission_id");

-- AddForeignKey
ALTER TABLE "tb_user_role" ADD CONSTRAINT "tb_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_role" ADD CONSTRAINT "tb_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tb_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_role_permission" ADD CONSTRAINT "tb_role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "tb_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_role_permission" ADD CONSTRAINT "tb_role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "tb_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
