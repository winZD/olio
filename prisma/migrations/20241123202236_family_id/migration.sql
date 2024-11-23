/*
  Warnings:

  - Added the required column `familyId` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshTokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GRANTED',
    "familyId" TEXT NOT NULL
);
INSERT INTO "new_RefreshTokens" ("createdAt", "expiresAt", "id", "status", "token", "userId") SELECT "createdAt", "expiresAt", "id", "status", "token", "userId" FROM "RefreshTokens";
DROP TABLE "RefreshTokens";
ALTER TABLE "new_RefreshTokens" RENAME TO "RefreshTokens";
CREATE INDEX "RefreshTokens_familyId_idx" ON "RefreshTokens"("familyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
