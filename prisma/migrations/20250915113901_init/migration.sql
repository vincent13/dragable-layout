-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lg" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Screen" (
    "screenId" TEXT NOT NULL PRIMARY KEY,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_LayoutScreens" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LayoutScreens_A_fkey" FOREIGN KEY ("A") REFERENCES "Layout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LayoutScreens_B_fkey" FOREIGN KEY ("B") REFERENCES "Screen" ("screenId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_LayoutScreens_AB_unique" ON "_LayoutScreens"("A", "B");

-- CreateIndex
CREATE INDEX "_LayoutScreens_B_index" ON "_LayoutScreens"("B");
