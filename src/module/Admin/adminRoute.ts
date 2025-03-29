import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { adminController } from "./adminController";

const router = Router();

router.patch(
  "/update-role",
  authMiddleware(["super-admin"]),
  adminController.updateUserRole
);
router.patch(
  "/update-status",
  authMiddleware(["admin", "super-admin"]),
  adminController.updateUserStatus
);
router.patch(
  "/verify-product",
  authMiddleware(["admin"]),
  adminController.verifyProduct
);
router.patch(
  "/update-order-status",
  authMiddleware(["seller", "admin"]),
  adminController.updateOrderStatus
);

export const adminRoute = router;
