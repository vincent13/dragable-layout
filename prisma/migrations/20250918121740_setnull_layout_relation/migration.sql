-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Screens" (
    "screenId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "layoutId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Screens_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Screens" ("layoutId", "name", "screenId", "updatedAt") SELECT "layoutId", "name", "screenId", "updatedAt" FROM "Screens";
DROP TABLE "Screens";
ALTER TABLE "new_Screens" RENAME TO "Screens";
CREATE INDEX "Screens_layoutId_idx" ON "Screens"("layoutId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
