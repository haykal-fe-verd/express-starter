-- CreateTable
CREATE TABLE "tb_user" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMPTZ(6),
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE INDEX "idx_tb_user_email" ON "tb_user"("email");

-- CreateIndex
CREATE INDEX "idx_tb_user_created_at" ON "tb_user"("created_at");

-- CreateIndex
CREATE INDEX "idx_tb_user_email_verified_at" ON "tb_user"("email_verified_at");

-- CreateIndex
CREATE INDEX "idx_tb_user_email_verified" ON "tb_user"("email", "email_verified_at");
