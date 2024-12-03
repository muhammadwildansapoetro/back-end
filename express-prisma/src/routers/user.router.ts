import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkAdmin, verifyToken } from "../middleware/verify";
import { uploader } from "../services/uploader";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, checkAdmin, this.userController.getUsers);
    this.router.post("/", this.userController.createUser);
    this.router.get("/profile", verifyToken, this.userController.getUserById);
    this.router.patch(
      "/avatar",
      verifyToken,
      uploader("diskStorage", "avatar-", "/avatar").single("file"),
      this.userController.updateAvatar
    );
    this.router.patch(
      "/avatar-cloud",
      verifyToken,
      uploader("memoryStorage", "avatar-").single("file"),
      this.userController.updateAvatarCloud
    );

    this.router.patch("/:id", this.userController.editUser);
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
