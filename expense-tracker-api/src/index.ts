import express, { Application, Request, Response } from "express"
import cors from 'cors'
import "dotenv/config"
import { ExpenseRouter } from "./routers/expense.router"
import pool from "./config/db"
import { ExpenseV2Router } from "./routers/expense-v2.router"

const PORT: number = 8000

const app: Application = express()
app.use(cors())
app.use(express.json())

app.get("/api", (req: Request, res: Response) => {
    res.status(200).send("Expense Tracker API")
})

const expenseRouter = new ExpenseRouter()
const expenseV2Router = new ExpenseV2Router()

app.use("/api/expense", expenseRouter.getRouter())
app.use("/api/v2/expense", expenseV2Router.getRouter())

pool.connect((error, client, release) => {
    if (error) {
        return console.log("Error acquiring client ❌", error.stack);
    }
    if (client) {
        client.query("SET search_path TO test", (queryError) => {
            if (queryError) {
                console.error("Error setting search path", queryError.stack)
            } else {
                console.log("Success Connection ✅");
            }

            release()
        })
    }

})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})