import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { adminController } from "./adminController";

const router = Router();

router.patch(
  "/update-user-role",
  authMiddleware(["super-admin"]),
  adminController.updateUserRole
);
router.patch(
  "/update-user-status",
  authMiddleware(["admin", "super-admin"]),
  adminController.updateUserStatus
);
router.patch(
  "/verify-product",
  authMiddleware(["admin", "super-admin"]),
  adminController.verifyProduct
);
router.patch(
  "/update-order-status",
  authMiddleware(["seller", "admin", "super-admin"]),
  adminController.updateOrderStatus
);

export const adminRoute = router;
