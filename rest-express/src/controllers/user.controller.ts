import { Request, Response } from "express"
import fs from "fs" // file system - untuk membaca data dalam database (db/user.json)
import { IUser } from "../types/user"

export class UserController {
    getUsers(req: Request, res: Response) {
        const users = JSON.parse(fs.readFileSync("./db/users.json", "utf-8")) // utf-8 = charset
        res.status(200).send({ users })
    }

    getUserId(req: Request, res: Response) {
        const { id } = req.params
        const users: IUser[] = JSON.parse(fs.readFileSync("./db/users.json", "utf-8"))
        const data = users.find((item) => item.id == +id) // karena id awalnya string, maka dikasih + agar jadi number, sama dengan parseInt
        if (data) {
            res.status(200).send({ user: data })
        } else {
            res.status(404).send({ message: "User not found" })
        }
    }

    addUser(req: Request, res: Response) {
        const users: IUser[] = JSON.parse(fs.readFileSync("./db/users.json", "utf-8"))
        const id = Math.max(...users.map(item => item.id)) + 1
        const { name, email, password } = req.body
        const newData: IUser = { id, name, email, password }
        users.push(newData)

        fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8")

        res.status(200).send({ user: newData })
    }


}