/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProcessPriority" AS ENUM ('NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "Process" (
    "sigad" TEXT NOT NULL,
    "priority" "ProcessPriority" NOT NULL DEFAULT 'NORMAL',
    "subject" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,
    "trackerId" TEXT,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("sigad")
);

-- CreateTable
CREATE TABLE "ProcessHistory" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "processSigad" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackerTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "trackerId" TEXT NOT NULL,

    CONSTRAINT "TrackerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessTask" (
    "id" TEXT NOT NULL,
    "processSigad" TEXT NOT NULL,
    "trackerTaskId" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProcessTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tracker_name_key" ON "Tracker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TrackerTask_trackerId_order_key" ON "TrackerTask"("trackerId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessTask_processSigad_trackerTaskId_key" ON "ProcessTask"("processSigad", "trackerTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentTemplate_name_key" ON "DocumentTemplate"("name");

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessHistory" ADD CONSTRAINT "ProcessHistory_processSigad_fkey" FOREIGN KEY ("processSigad") REFERENCES "Process"("sigad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessHistory" ADD CONSTRAINT "ProcessHistory_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerTask" ADD CONSTRAINT "TrackerTask_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Tracker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessTask" ADD CONSTRAINT "ProcessTask_processSigad_fkey" FOREIGN KEY ("processSigad") REFERENCES "Process"("sigad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessTask" ADD CONSTRAINT "ProcessTask_trackerTaskId_fkey" FOREIGN KEY ("trackerTaskId") REFERENCES "TrackerTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
