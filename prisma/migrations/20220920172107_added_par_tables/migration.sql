-- CreateTable
CREATE TABLE "ParCor" (
    "id" SERIAL NOT NULL,
    "lvl" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ParCor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParUserExp" (
    "id" SERIAL NOT NULL,
    "lvl" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ParUserExp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParWeaponExp" (
    "id" SERIAL NOT NULL,
    "lvl" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ParWeaponExp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParCor_lvl_key" ON "ParCor"("lvl");

-- CreateIndex
CREATE UNIQUE INDEX "ParUserExp_lvl_key" ON "ParUserExp"("lvl");

-- CreateIndex
CREATE UNIQUE INDEX "ParWeaponExp_lvl_key" ON "ParWeaponExp"("lvl");
