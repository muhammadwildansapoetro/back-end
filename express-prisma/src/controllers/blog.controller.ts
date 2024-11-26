import { Request, Response } from "express";
import prisma from "../prisma";

export class BlogController {
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          image: true,
          user: {
            select: {
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      res.status(200).send({ blogs });
    } catch (error) {
      console.log(error);

      res.status(400).send(error);
    }
  }
}
