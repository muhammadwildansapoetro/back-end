import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/user";
import fs from "fs"

export class UserMiddleWare {
    checkId(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )
        const data = users.find((user) => user.id == +id)
        // karena id awalnya string, maka dikasih + agar jadi number, sama dengan parseInt

        if (data) {
            next()
        } else {
            res.status(404).send({ message: "User not found" })
        }
    }
}