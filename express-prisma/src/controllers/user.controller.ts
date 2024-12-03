import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { cloudinaryUpload } from "../services/cloudinary";

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const { search, page = 1, limit = 3 } = req.query;
      const filter: Prisma.UserWhereInput = {};

      if (search) {
        // filter.username = { contains: search as string }
        filter.OR = [
          { username: { contains: search as string, mode: "insensitive" } },
          { email: search as string },
        ];
      }

      const count_user = await prisma.user.aggregate({
        _count: { _all: true },
      });

      const total_page = Math.ceil(+count_user._count._all / +limit);

      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });

      res.status(200).send({ total_page, page, users });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      res.status(200).send({ user });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      await prisma.user.create({ data: req.body });
      res.status(201).send("User Created Successfully ✅");
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.update({ data: req.body, where: { id: +id } });
      res.status(200).send(`User ID ${id} Updated Successfully ✅`);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: +id } });
      res.status(200).send(`User ID ${id} Deleted Successfully ✅`);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updateAvatar(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "File empty" };
      const link = `http://localhost:8000/api/public/avatar/${req.file.filename}`;
      await prisma.user.update({
        data: { avatar: link },
        where: { id: req.user?.id },
      });

      res.status(200).send({ message: "Avatar updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updateAvatarCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "File empty" };
      const { secure_url } = await cloudinaryUpload(req.file, "avatar");

      await prisma.user.update({
        data: { avatar: secure_url },
        where: { id: req.user?.id },
      });

      res.status(200).send({ message: "Avatar updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
