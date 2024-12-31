-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Variety" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "origin" TEXT,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    "treeNumber" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Variety_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Variety" ("description", "id", "name", "orchardId", "orchardUserId", "origin") SELECT "description", "id", "name", "orchardId", "orchardUserId", "origin" FROM "Variety";
DROP TABLE "Variety";
ALTER TABLE "new_Variety" RENAME TO "Variety";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
