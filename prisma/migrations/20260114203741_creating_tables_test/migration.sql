-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "sigad" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("sigad")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
