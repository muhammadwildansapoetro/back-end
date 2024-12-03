import { Request } from "express";
import multer from "multer";
import path from "path";

type DestinationCalback = (error: Error | null, destination: string) => void;
type FileNameCalback = (error: Error | null, fileName: string) => void;

export const uploader = (
  type: "memoryStorage" | "diskStorage" = "memoryStorage",
  filePrefix: string,
  folderName?: string
) => {
  const defaultDir = path.join(__dirname, "../../public");

  const storage =
    type == "memoryStorage"
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCalback
          ) => {
            const destination = folderName
              ? defaultDir + folderName
              : defaultDir;
            cb(null, destination);
          },

          filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCalback
          ) => {
            // image.jpg
            const originalNameParts = file.originalname.split("."); // [image, jpg]
            const fileExtension =
              originalNameParts[originalNameParts.length - 1]; // jpg
            const newFileNmae = filePrefix + Date.now() + "." + fileExtension;
            cb(null, newFileNmae);
          },
        });

  return multer({ storage });
};
