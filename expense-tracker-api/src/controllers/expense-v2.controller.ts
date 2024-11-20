import { Request, Response } from "express";
import pool from "../config/db";
import { IExpense } from "../types/expense";

export class ExpenseV2Controller {

    async getExpenses(req: Request, res: Response) {
        const result = await pool.query("select * from expense")
        const expenses: IExpense[] = result.rows

        res.status(200).send({ expenses })
    }

}