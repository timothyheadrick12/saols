-- CreateTable
CREATE TABLE "BattlePrompts" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "BattlePrompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrompts" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MarketPrompts_pkey" PRIMARY KEY ("id")
);
