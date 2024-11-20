import { NextFunction, Request, Response } from "express";
import { IExpense } from "../types/expense";
import fs from "fs"

export class ExpenseMiddleware {
    checkId(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )
        const data = expenses.find((expense) => expense.id == +id)

        if (data) {
            next()
        } else {
            res.status(404).send({ message: "Expense not found" })
        }
    }
}