import { Router } from "express";
import { ExpenseV2Controller } from "../controllers/expense-v2.controller";

export class ExpenseV2Router {
    private router: Router
    private expenseV2Controller: ExpenseV2Controller

    constructor() {
        this.router = Router()
        this.expenseV2Controller = new ExpenseV2Controller
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/", this.expenseV2Controller.getExpenses)
    }

    getRouter(): Router {
        return this.router
    }
}