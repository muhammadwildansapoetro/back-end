import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../services/cloudinary";

export class BlogController {
  async getBlogs(req: Request, res: Response) {
    try {
      const blogs = await prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          image: true,
          category: true,
          slug: true,
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

  async getBlogSlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const blog = await prisma.blog.findUnique({
        where: { slug: slug }, // karena nama key dan nama value sama, bisa ditulis { slug }
        select: {
          id: true,
          title: true,
          category: true,
          image: true,
          slug: true,
          createdAt: true,
          content: true,
          user: {
            select: { username: true },
          },
        },
      });
      res.status(200).send({ blog });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "image empty" };
      const { secure_url } = await cloudinaryUpload(req.file, "blog");
      const { title, slug, category, content } = req.body;

      await prisma.blog.create({
        data: {
          title,
          slug,
          category,
          content,
          image: secure_url,
          userId: req.user?.id!,
        },
      });

      res.status(200).send({ message: "Post created successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
