-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Orchard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "soilType" TEXT NOT NULL,
    "irrigation" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Orchard_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Variety" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "origin" TEXT,
    "orchardId" TEXT NOT NULL,
    "orchardTenantId" TEXT NOT NULL,
    CONSTRAINT "Variety_orchardId_orchardTenantId_fkey" FOREIGN KEY ("orchardId", "orchardTenantId") REFERENCES "Orchard" ("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plantedDate" DATETIME NOT NULL,
    "age" INTEGER NOT NULL,
    "varietyId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardTenantId" TEXT NOT NULL,
    CONSTRAINT "Tree_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tree_orchardId_orchardTenantId_fkey" FOREIGN KEY ("orchardId", "orchardTenantId") REFERENCES "Orchard" ("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "quantity" REAL NOT NULL,
    "quality" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardTenantId" TEXT NOT NULL,
    CONSTRAINT "Harvest_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Harvest_orchardId_orchardTenantId_fkey" FOREIGN KEY ("orchardId", "orchardTenantId") REFERENCES "Orchard" ("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "salary" REAL NOT NULL,
    "orchardId" TEXT NOT NULL,
    "orchardTenantId" TEXT NOT NULL,
    "hiredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Employee_orchardId_orchardTenantId_fkey" FOREIGN KEY ("orchardId", "orchardTenantId") REFERENCES "Orchard" ("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "harvestId" TEXT,
    CONSTRAINT "Product_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Orchard_id_tenantId_key" ON "Orchard"("id", "tenantId");
