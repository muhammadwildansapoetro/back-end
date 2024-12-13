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
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../services/cloudinary");
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, page = 1, limit = 3 } = req.query;
                const filter = {};
                if (search) {
                    // filter.username = { contains: search as string }
                    filter.OR = [
                        { username: { contains: search, mode: "insensitive" } },
                        { email: search },
                    ];
                }
                const count_user = yield prisma_1.default.user.aggregate({
                    _count: { _all: true },
                });
                const total_page = Math.ceil(+count_user._count._all / +limit);
                const users = yield prisma_1.default.user.findMany({
                    where: filter,
                    orderBy: { id: "asc" },
                    take: +limit,
                    skip: +limit * (+page - 1),
                });
                res.status(200).send({ total_page, page, users });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ user });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.user.create({ data: req.body });
                res.status(201).send("User Created Successfully ✅");
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.update({ data: req.body, where: { id: +id } });
                res.status(200).send(`User ID ${id} Updated Successfully ✅`);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.delete({ where: { id: +id } });
                res.status(200).send(`User ID ${id} Deleted Successfully ✅`);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    updateAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "File empty" };
                const link = `http://localhost:8000/api/public/avatar/${req.file.filename}`;
                yield prisma_1.default.user.update({
                    data: { avatar: link },
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ message: "Avatar updated successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    updateAvatarCloud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "File empty" };
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "avatar");
                yield prisma_1.default.user.update({
                    data: { avatar: secure_url },
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(200).send({ message: "Avatar updated successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
}
exports.UserController = UserController;
