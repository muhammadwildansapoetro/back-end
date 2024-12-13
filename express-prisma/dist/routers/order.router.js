"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const verify_1 = require("../middleware/verify");
class OrderRouter {
    constructor() {
        this.orderController = new order_controller_1.OrderController();
        this.router = (0, express_1.Router)();
    }
    initializeRoutes() {
        this.router.post("/", verify_1.verifyToken, this.orderController.createOrder);
        this.router.post("/status", verify_1.verifyToken, this.orderController.updateStatus);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
