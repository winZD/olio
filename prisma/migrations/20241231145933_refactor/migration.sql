-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantedDate" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "varietyId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Tree_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tree_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tree" ("age", "id", "orchardId", "orchardUserId", "plantedDate", "varietyId") SELECT "age", "id", "orchardId", "orchardUserId", "plantedDate", "varietyId" FROM "Tree";
DROP TABLE "Tree";
ALTER TABLE "new_Tree" RENAME TO "Tree";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
