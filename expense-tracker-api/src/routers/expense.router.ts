import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";
import { ExpenseMiddleware } from "../middleware/expense.middleware";

export class ExpenseRouter {
    private router: Router
    private expenseController: ExpenseController
    private expenseMiddleware: ExpenseMiddleware

    constructor() {
        this.expenseController = new ExpenseController()
        this.expenseMiddleware = new ExpenseMiddleware()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/', this.expenseController.getExpenses)
        this.router.post('/', this.expenseController.addExpense)

        this.router.get(
            '/:id',
            this.expenseMiddleware.checkId,
            this.expenseController.getExpenseById)
        this.router.patch(
            '/:id',
            this.expenseMiddleware.checkId,
            this.expenseController.editExpenses)
        this.router.delete(
            '/:id',
            this.expenseMiddleware.checkId,
            this.expenseController.deleteExpense)
    }

    getRouter(): Router {
        return this.router
    }
}