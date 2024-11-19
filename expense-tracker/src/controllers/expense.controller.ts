import { Request, Response } from "express";
import fs from "fs"
import { IExpense } from "../types/expense";

export class ExpenseController {

    getExpenses(req: Request, res: Response) {
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        res.status(200).send({ expenses })
    }

    getExpenseById(req: Request, res: Response) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )
        const data = expenses.find((expense) => expense.id == +id) // +id = parseInt(id)
        res.status(200).send({ data })
    }

    getTotalExpenseByDate(req: Request, res: Response) {
        const { startDate, endDate } = req.query
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const start = new Date(startDate as string)
        const end = new Date(endDate as string)

        const totalExpense = expenses
            .filter((expense) => expense.type === "expense" && new Date(expense.date) >= start && new Date(expense.date) <= end)
            .reduce((sum, expense) => sum + expense.nominal, 0)

        res.status(200).send({ From: startDate, To: endDate, TotalExpense: totalExpense })
    }

    getTotalExpenseByCategory(req: Request, res: Response) {
        const { category } = req.query
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const totalExpense = expenses
            .filter((expense) => expense.type === "expense" && expense.category === category)
            .reduce((sum, expense) => sum + expense.nominal, 0)


        res.status(200).send({ Category: category, TotalExpense: totalExpense })
    }

    addExpenses(req: Request, res: Response) {
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const id = expenses.length + 1
        const { title, nominal, type, category, date } = req.body
        const newExpenses: IExpense = { id, title, nominal, type, category, date }

        expenses.push(newExpenses)

        fs.writeFileSync("./db/expenses.json", JSON.stringify(expenses), "utf-8")

        res.status(201).send({ message: "Successfully added new expense", expense: newExpenses })
    }

    editExpenses(req: Request, res: Response) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const expenseIndex = expenses.findIndex((expense) => expense.id == +id)
        expenses[expenseIndex] = { ...expenses[expenseIndex], ...req.body }

        fs.writeFileSync("./db/expenses.json", JSON.stringify(expenses), "utf-8")

        res.status(201).send({ message: `Successfully updated expense data`, expense: expenses[expenseIndex] })
    }

    deleteExpense(req: Request, res: Response) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const newExpenses = expenses.filter(expense => expense.id != +id)

        fs.writeFileSync("./db/expenses.json", JSON.stringify(newExpenses), "utf-8")

        res.status(200).send(`Expense ID ${id} successfully deleted`)
    }


}