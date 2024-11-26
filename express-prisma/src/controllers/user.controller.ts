import { Request, Response } from "express";
import prisma from "../prisma";

export class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            res.status(200).send({ users });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
}