import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign } from "jsonwebtoken";
import { transporter } from "../services/mailer";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      const user = await findUser(username, email);

      if (user) throw { message: "Username or email has been used" };
      // if (password != confirmPassword) throw { message: "Password not match" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      await prisma.user.create({
        data: { username, email, password: hashPassword },
      });

      await transporter.sendMail({
        from: "muhwilsap@gmail.com",
        to: email,
        subject: "Welcome To Ngariung Blog",
        html: "<h1>Thank you</h1>",
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
      if (user.isSuspend) throw { message: "Account suspended" };
      if (!user.isVerify) throw { message: "Account not verified" };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        await prisma.user.update({
          data: { loginAttempt: { increment: 1 } },
          where: { id: user.id },
        });
        if (user.loginAttempt == 2) {
          await prisma.user.update({
            data: { isSuspend: true },
            where: { id: user.id },
          });
        }
        throw { message: "Incorrect Password" };
      }

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
