import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {
  private authController: AuthController;
  private router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.authController.registerUser);
    this.router.post("/sign-in", this.authController.signInUser);

    this.router.patch("/verify/:token", this.authController.verifyUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
