/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Employee";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tree";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "quality" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Harvest_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Harvest" ("id", "orchardId", "orchardUserId", "quality", "quantity", "treeId", "year") SELECT "id", "orchardId", "orchardUserId", "quality", "quantity", "treeId", "year" FROM "Harvest";
DROP TABLE "Harvest";
ALTER TABLE "new_Harvest" RENAME TO "Harvest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
