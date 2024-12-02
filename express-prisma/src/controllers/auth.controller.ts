import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign } from "jsonwebtoken";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword, username, email } = req.body;
      const user = await findUser(username, email);

      if (user) throw { message: "Username or email has been used" };
      if (password != confirmPassword) throw { message: "Password not match" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      await prisma.user.create({
        data: { username, email, password: hashPassword },
      });
      res.status(200).send({ message: "Register Successfully ✅" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
  async signInUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Account not found" };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw { message: "Incorrect Password" };

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, "blog-app", { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({
          message: "Sign in Successfully ✅",
          user,
        });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
