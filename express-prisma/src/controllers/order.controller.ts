import { Request, Response } from "express";
import prisma from "../prisma";
import axios from "axios";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { price } = req.body;

      function addMinutes(date: Date, minutes: number) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
      }

      const date = new Date();
      const newDate = addMinutes(date, 10);

      const order = await prisma.order.create({
        data: { price, userId: req.user?.id!, expiredAt: "" },
      });

      const body = {
        transaction_details: {
          order_id: order.id,
          gross_amount: price,
        },
        expiry: {
          unit: "minutes",
          duration: 10,
        },
      };

      const { data } = await axios.post(
        "https://app.sandbox.midtrans.com/snap/v1/transactions",
        body,
        {
          headers: {
            Authorization:
              "Basic U0ItTWlkLXNlcnZlci1Wc1BIVXh6WVBqRjc3ajNRcEdIQ3hzZDM6Cg==",
          },
        }
      );

      await prisma.order.update({
        data: { redirect_url: data.redirect_url },
        where: { id: order.id },
      });

      res
        .status(201)
        .send({ message: "Order created successfully", data, order });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { transaction_status, order_id } = req.body;
      if (transaction_status == "settlement") {
        await prisma.order.update({
          data: { status: "paid" },
          where: { id: +order_id },
        });
      }
      res.status(200).send({ message: "Order updated" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
