-- CreateTable
CREATE TABLE "tb_user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_board" (
    "id" TEXT NOT NULL,
    "id_category" TEXT,
    "name" TEXT NOT NULL,
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_request" (
    "id" TEXT NOT NULL,
    "board_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "reference_photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_category_name_key" ON "tb_category"("name");

-- CreateIndex
CREATE INDEX "tb_board_id_category_idx" ON "tb_board"("id_category");

-- CreateIndex
CREATE INDEX "tb_request_board_id_idx" ON "tb_request"("board_id");

-- AddForeignKey
ALTER TABLE "tb_board" ADD CONSTRAINT "tb_board_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "tb_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_request" ADD CONSTRAINT "tb_request_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "tb_board"("id") ON DELETE SET NULL ON UPDATE CASCADE;
