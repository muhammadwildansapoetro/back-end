import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
    private userController: UserController;
    private router: Router;

    constructor() {
        this.userController = new UserController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", this.userController.getUsers);
    }

    getRouter(): Router {
        return this.router;
    }
}