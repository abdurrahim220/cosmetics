import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { orderController } from "./order.controller";

const router = Router();

router.post(
  "/",
  authMiddleware(["buyer"]),
  orderController.createOrUpdateOrder
);

router.post("/", authMiddleware(["buyer"]), orderController.cancelOrder);

router.get(
  "/",
  authMiddleware(["buyer", "admin", "seller"]),
  orderController.getAllOrder
);

export const orderRoute = router;
