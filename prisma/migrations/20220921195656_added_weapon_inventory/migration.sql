-- CreateTable
CREATE TABLE "_WeaponInventory" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WeaponInventory_AB_unique" ON "_WeaponInventory"("A", "B");

-- CreateIndex
CREATE INDEX "_WeaponInventory_B_index" ON "_WeaponInventory"("B");

-- AddForeignKey
ALTER TABLE "_WeaponInventory" ADD CONSTRAINT "_WeaponInventory_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WeaponInventory" ADD CONSTRAINT "_WeaponInventory_B_fkey" FOREIGN KEY ("B") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
