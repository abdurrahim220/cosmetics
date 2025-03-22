import { Router } from "express";
import { AuthController } from "./auth.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/", AuthController.loginUser);
router.post(
  "/logout",
  authMiddleware(["admin", "buyer", "seller", "super-admin"]),
  AuthController.logOutUser
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/change-password", AuthController.changeUserPassword);
router.post("/", AuthController.refreshToken);

export const authRoute = router;
