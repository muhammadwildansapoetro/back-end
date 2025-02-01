"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../services/cloudinary");
class BlogController {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield prisma_1.default.blog.findMany({
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
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getBlogSlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const blog = yield prisma_1.default.blog.findUnique({
                    where: { slug: slug },
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
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "image empty" };
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "blog");
                const { title, slug, category, content } = req.body;
                yield prisma_1.default.blog.create({
                    data: {
                        title,
                        slug,
                        category,
                        content,
                        image: secure_url,
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    },
                });
                res.status(200).send({ message: "Post created successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.BlogController = BlogController;
