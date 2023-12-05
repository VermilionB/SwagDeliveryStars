-- CreateTable
CREATE TABLE "beats" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "user_name" VARCHAR(255),
    "genre_id" UUID,
    "license_id" UUID,
    "duration" TIME(6),
    "audio_preview" VARCHAR(255),
    "description" TEXT,
    "likes" INTEGER,
    "reposts_count" INTEGER,
    "tags" VARCHAR(255)[],

    CONSTRAINT "beats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "genre" VARCHAR(50),

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "license" VARCHAR(20),
    "price" DECIMAL(10,2),
    "description" TEXT,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_history" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "beat_id" UUID,
    "purchase_date" TIMESTAMP(6),
    "total_price" DECIMAL(10,2),

    CONSTRAINT "order_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings_reviews" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "beat_id" UUID,
    "user_id" UUID,
    "rating" INTEGER,
    "comment" TEXT,

    CONSTRAINT "ratings_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reposts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "beat_id" UUID,

    CONSTRAINT "reposts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "shopping_cart_id" UUID,
    "beat_id" UUID,

    CONSTRAINT "shopping_cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "total_sales" INTEGER,
    "negotiations" INTEGER,
    "new_followers" INTEGER,
    "plays" INTEGER,
    "reposts" INTEGER,
    "comments" INTEGER,
    "free_downloads" INTEGER,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SMALLINT NOT NULL,
    "role_name" VARCHAR(32),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "bio" TEXT,
    "followers" INTEGER,
    "contact_info" VARCHAR(255),
    "social_links" VARCHAR(255)[],
    "is_banned" BOOLEAN DEFAULT false,
    "role_id" SMALLINT DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "beats" ADD CONSTRAINT "beats_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beats" ADD CONSTRAINT "beats_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_beat_id_fkey" FOREIGN KEY ("beat_id") REFERENCES "beats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings_reviews" ADD CONSTRAINT "ratings_reviews_beat_id_fkey" FOREIGN KEY ("beat_id") REFERENCES "beats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings_reviews" ADD CONSTRAINT "ratings_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_beat_id_fkey" FOREIGN KEY ("beat_id") REFERENCES "beats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shopping_cart_items" ADD CONSTRAINT "shopping_cart_items_beat_id_fkey" FOREIGN KEY ("beat_id") REFERENCES "beats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shopping_cart_items" ADD CONSTRAINT "shopping_cart_items_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
