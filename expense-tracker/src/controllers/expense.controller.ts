import { Request, Response } from "express";
import fs from "fs"
import { IExpense } from "../types/expense";

export class ExpenseController {

    // Get expense list
    getExpenses(req: Request, res: Response) {
        const { title, type, category, start, end } = req.query
        let expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        expenses = expenses.filter((expense) => {
            let isValid: boolean = true
            // get expenses by title
            if (title) {
                isValid = isValid && expense.title.toLocaleLowerCase().includes(title as string)
            }
            // get expenses by type
            if (type) {
                isValid = isValid && expense.type == type // if true && false = false
            }
            // get expenses by category
            if (category) {
                isValid = isValid && expense.category == category // if true && false = false
            }
            // get expenses by date range
            if (start && end) {
                const startDate = new Date(start as string)
                const endDate = new Date(end as string)
                const expenseDate = new Date(expense.date)

                isValid = isValid && expenseDate >= startDate && expenseDate <= endDate
            }
            return isValid
        })

        const totalIncome = expenses
            .filter((expense) => expense.type === "income")
            .reduce((sum, expense) => sum + expense.nominal, 0)

        const totalExpense = expenses
            .filter((expense) => expense.type === "expense")
            .reduce((sum, expense) => sum + expense.nominal, 0)

        const balance = totalIncome - totalExpense

        res.status(200).send({ Total_Incomes: totalIncome, Total_Expenses: totalExpense, Balance: balance, Expenses_List: expenses })
    }

    // Get expense detail
    getExpenseById(req: Request, res: Response) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )
        const expense = expenses.find((expense) => expense.id == +id) // +id = parseInt(id)
        res.status(200).send({ expense })
    }

    // Create new expense data
    addExpense(req: Request, res: Response) {
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const maxId = Math.max(...expenses.map((expense) => expense.id))
        const id = expenses.length == 0 ? 1 : maxId + 1
        const { title, nominal, type, category, date } = req.body
        const newExpenses: IExpense = { id, title, nominal, type, category, date }

        expenses.push(newExpenses)

        fs.writeFileSync("./db/expenses.json", JSON.stringify(expenses), "utf-8")

        res.status(201).send({ message: "Successfully added new expense", expense: newExpenses })
    }

    // Edit expense data
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

    // Delete expense data
    deleteExpense(req: Request, res: Response) {
        const { id } = req.params
        const expenses: IExpense[] = JSON.parse(
            fs.readFileSync("./db/expenses.json", "utf-8")
        )

        const newExpenses = expenses.filter(expense => expense.id != +id)

        fs.writeFileSync("./db/expenses.json", JSON.stringify(newExpenses), "utf-8")

        res.status(200).send(`Expense ID ${id} deleted successfully`)
    }
}