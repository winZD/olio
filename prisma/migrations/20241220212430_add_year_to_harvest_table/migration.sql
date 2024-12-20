/*
  Warnings:

  - You are about to drop the column `date` on the `Harvest` table. All the data in the column will be lost.
  - Added the required column `year` to the `Harvest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "quality" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Harvest_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Harvest_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Harvest" ("id", "orchardId", "orchardUserId", "quality", "quantity", "treeId") SELECT "id", "orchardId", "orchardUserId", "quality", "quantity", "treeId" FROM "Harvest";
DROP TABLE "Harvest";
ALTER TABLE "new_Harvest" RENAME TO "Harvest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
