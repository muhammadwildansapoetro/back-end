import { Request, Response } from "express";
import pool from "../config/db";
import { IExpense } from "../types/expense";

export class ExpenseV2Controller {

    async getExpenses(req: Request, res: Response) {
        const { category, } = req.query
        let query = "select * from expense"

        if (category) {
            query += ` where category = '${category}'`
        }

        query += " order by id asc"
        const result = await pool.query(query)
        const expenses: IExpense[] = result.rows

        res.status(200).send({ expenses })
    }

    async getExpenseById(req: Request, res: Response) {
        const { id } = req.params
        const result = await pool.query(`select * from expense where id = ${id}`)
        const expense: IExpense = result.rows[0]

        if (expense) {
            res.status(200).send({ expense })
        } else {
            res.status(404).send({ message: "Expense not found" })
        }
    }

    async addExpense(req: Request, res: Response) {
        const { title, nominal, type, category, date } = req.body
        await pool.query(
            `insert into expense (title, nominal, type, category, date)
            values ('${title}', ${nominal}, '${type}', '${category}', '${date}')`
        )

        res.status(201).send({ message: "Expense added successfully ✅" })
    }

    async editExpense(req: Request, res: Response) {
        const { id } = req.params
        const query = []

        for (let key in req.body) {
            query.push(`${key} = '${req.body[key]}'`)
        }

        console.log(query);

        await pool.query(`update expense set ${query.join(", ")} where id = ${id}`)

        res.status(200).send({ message: "Expense updated successfully ✅" })
    }

    async deleteExpense(req: Request, res: Response) {
        const { id } = req.params

        await pool.query(`delete from expense where id = ${id}`)

        res.status(200).send("Expense deleted successfully ✅")
    }

}