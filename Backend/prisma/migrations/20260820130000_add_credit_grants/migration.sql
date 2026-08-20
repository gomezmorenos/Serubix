-- CreateTable
CREATE TABLE "credit_grants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_grants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_grants_userId_idx" ON "credit_grants"("userId");

-- AddForeignKey
ALTER TABLE "credit_grants" ADD CONSTRAINT "credit_grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
