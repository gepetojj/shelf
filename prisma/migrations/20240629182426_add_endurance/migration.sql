-- CreateTable
CREATE TABLE "Endurance" (
    "userId" TEXT NOT NULL,
    "sequence" DATE[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Endurance_userId_key" ON "Endurance"("userId");

-- AddForeignKey
ALTER TABLE "Endurance" ADD CONSTRAINT "Endurance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
