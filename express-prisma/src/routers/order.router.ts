import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { verifyToken } from "../middleware/verify";

export class OrderRouter {
  private orderController: OrderController;
  private router: Router;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
  }
  private initializeRoutes() {
    this.router.post("/", verifyToken, this.orderController.createOrder);
    this.router.post("/status", verifyToken, this.orderController.updateStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
