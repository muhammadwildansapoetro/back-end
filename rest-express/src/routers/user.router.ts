import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { UserMiddleWare } from "../middleware/user.middleware"

export class UserRouter {
    private router: Router
    private userController: UserController
    private userMiddleWare: UserMiddleWare

    constructor() {
        this.userController = new UserController()
        this.userMiddleWare = new UserMiddleWare()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/', this.userController.getUsers)
        this.router.post('/', this.userController.addUser)

        // '/:id' dynamic routing , params harus paling bawah , data unique (key)
        this.router.get('/:id', this.userController.getUserId)
        this.router.patch(
            '/:id',
            this.userMiddleWare.checkId,
            this.userController.editUser)
        this.router.delete(
            '/:id',
            this.userMiddleWare.checkId,
            this.userController.deleteUser)
    }

    getRouter(): Router {
        return this.router
    }
}