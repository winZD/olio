-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orchard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "soilType" TEXT NOT NULL,
    "irrigation" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "numberOfTrees" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "Orchard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orchard" ("area", "createdAt", "id", "irrigation", "location", "name", "soilType", "updatedAt", "userId") SELECT "area", "createdAt", "id", "irrigation", "location", "name", "soilType", "updatedAt", "userId" FROM "Orchard";
DROP TABLE "Orchard";
ALTER TABLE "new_Orchard" RENAME TO "Orchard";
CREATE TABLE "new_Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantedDate" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "varietyId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Tree_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tree" ("age", "id", "orchardId", "orchardUserId", "plantedDate", "varietyId") SELECT "age", "id", "orchardId", "orchardUserId", "plantedDate", "varietyId" FROM "Tree";
DROP TABLE "Tree";
ALTER TABLE "new_Tree" RENAME TO "Tree";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
