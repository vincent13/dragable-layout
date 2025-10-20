/*
  Warnings:

  - You are about to drop the `Screen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LayoutScreens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Screen";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_LayoutScreens";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Screens" (
    "screenId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Screens_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Screens_layoutId_idx" ON "Screens"("layoutId");
