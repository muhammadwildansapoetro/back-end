import "express";
import { UserRole } from "../prisma/generated/client";

export type UserPayload = {
  id: number;
  role: UserRole;
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
