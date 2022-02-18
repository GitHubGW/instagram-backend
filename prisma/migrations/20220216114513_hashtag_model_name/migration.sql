/*
  Warnings:

  - You are about to drop the column `hashtag` on the `Hashtag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Hashtag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Hashtag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Hashtag_hashtag_key";

-- AlterTable
ALTER TABLE "Hashtag" DROP COLUMN "hashtag",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_name_key" ON "Hashtag"("name");
