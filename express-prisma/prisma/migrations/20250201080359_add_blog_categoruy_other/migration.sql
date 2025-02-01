-- AlterEnum
ALTER TYPE "BlogCategory" ADD VALUE 'Other';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DEFAULT 'https://cdn-icons-png.flaticon.com/512/266/266033.png';
