-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskIndex" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false
);
