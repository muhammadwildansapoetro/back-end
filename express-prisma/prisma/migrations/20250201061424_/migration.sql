/*
  Warnings:

  - The values [Programming,GIS] on the enum `BlogCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlogCategory_new" AS ENUM ('Agriculture', 'Technology', 'Football');
ALTER TABLE "Blog" ALTER COLUMN "category" TYPE "BlogCategory_new" USING ("category"::text::"BlogCategory_new");
ALTER TYPE "BlogCategory" RENAME TO "BlogCategory_old";
ALTER TYPE "BlogCategory_new" RENAME TO "BlogCategory";
DROP TYPE "BlogCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Order";

-- DropEnum
DROP TYPE "OrderStatus";
