import { Request, Response } from "express"
import fs from "fs" // file system - untuk membaca data dalam database (db/user.json)
import { IUser } from "../types/user"
import { log } from "console"

export class UserController {

    getUsers(req: Request, res: Response) {
        const { name } = req.query
        let users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )

        if (name) {
            users = users.filter((user) =>
                user.name.toLocaleLowerCase().includes(name as string))
        }

        res.status(200).send({ users })
    }

    getUserId(req: Request, res: Response) {
        const { id } = req.params
        const users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )
        const data = users.find((user) => user.id == +id) // +id convert type string to number
        res.status(200).send({ user: data })
    }

    addUser(req: Request, res: Response) {
        const users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )
        const id = Math.max(...users.map(item => item.id)) + 1
        const { name, email, password } = req.body
        const newData: IUser = { id, name, email, password }

        users.push(newData)

        fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8")

        res.status(201).send({ message: "Successfully added new user", user: newData })
    }

    editUser(req: Request, res: Response) {
        const { id } = req.params
        const users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )
        const userIndex = users.findIndex((user) => user.id == +id)
        users[userIndex] = { ...users[userIndex], ...req.body }

        fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8")

        res.status(200).send({ message: "User data updated successfully", user: users[userIndex] })
    }

    deleteUser(req: Request, res: Response) {
        const { id } = req.params
        const users: IUser[] = JSON.parse(
            fs.readFileSync("./db/users.json", "utf-8")
        )

        const newUsers = users.filter(user => user.id != +id)

        fs.writeFileSync("./db/users.json", JSON.stringify(newUsers), "utf-8")

        res.status(200).send(`User ID ${id} deleted successfully`)
    }
}
