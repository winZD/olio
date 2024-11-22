/*
  Warnings:

  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `orchardTenantId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `orchardTenantId` on the `Harvest` table. All the data in the column will be lost.
  - The primary key for the `Orchard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tenantId` on the `Orchard` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `RefreshTokens` table. All the data in the column will be lost.
  - You are about to drop the column `orchardTenantId` on the `Tree` table. All the data in the column will be lost.
  - You are about to drop the column `orchardTenantId` on the `Variety` table. All the data in the column will be lost.
  - Added the required column `orchardUserId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orchardUserId` to the `Harvest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Orchard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orchardUserId` to the `Tree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orchardUserId` to the `Variety` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tenant_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tenant";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "salary" REAL NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    "hiredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Employee_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Employee" ("hiredAt", "id", "name", "orchardId", "role", "salary") SELECT "hiredAt", "id", "name", "orchardId", "role", "salary" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE TABLE "new_Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "quantity" REAL NOT NULL,
    "quality" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Harvest_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Harvest_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Harvest" ("date", "id", "orchardId", "quality", "quantity", "treeId") SELECT "date", "id", "orchardId", "quality", "quantity", "treeId" FROM "Harvest";
DROP TABLE "Harvest";
ALTER TABLE "new_Harvest" RENAME TO "Harvest";
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

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "Orchard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orchard" ("area", "createdAt", "id", "irrigation", "location", "name", "soilType", "updatedAt") SELECT "area", "createdAt", "id", "irrigation", "location", "name", "soilType", "updatedAt" FROM "Orchard";
DROP TABLE "Orchard";
ALTER TABLE "new_Orchard" RENAME TO "Orchard";
CREATE TABLE "new_RefreshTokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GRANTED'
);
INSERT INTO "new_RefreshTokens" ("createdAt", "expiresAt", "id", "status", "token") SELECT "createdAt", "expiresAt", "id", "status", "token" FROM "RefreshTokens";
DROP TABLE "RefreshTokens";
ALTER TABLE "new_RefreshTokens" RENAME TO "RefreshTokens";
CREATE INDEX "RefreshTokens_userId_idx" ON "RefreshTokens"("userId");
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
INSERT INTO "new_Tree" ("age", "id", "orchardId", "plantedDate", "varietyId") SELECT "age", "id", "orchardId", "plantedDate", "varietyId" FROM "Tree";
DROP TABLE "Tree";
ALTER TABLE "new_Tree" RENAME TO "Tree";
CREATE TABLE "new_Variety" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "origin" TEXT,
    "orchardId" TEXT NOT NULL,
    "orchardUserId" TEXT NOT NULL,
    CONSTRAINT "Variety_orchardId_orchardUserId_fkey" FOREIGN KEY ("orchardId", "orchardUserId") REFERENCES "Orchard" ("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Variety" ("description", "id", "name", "orchardId", "origin") SELECT "description", "id", "name", "orchardId", "origin" FROM "Variety";
DROP TABLE "Variety";
ALTER TABLE "new_Variety" RENAME TO "Variety";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
