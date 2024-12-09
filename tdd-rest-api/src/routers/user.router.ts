import { Request, Response, Router } from "express";
import prisma from "../prisma";

export class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const users = await prisma.user.findMany();
        res.status(200).send({
          message: "OK",
          users: users,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
