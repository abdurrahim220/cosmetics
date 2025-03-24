import { Router } from "express";
import { UserController } from "./user.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/", UserController.createUser);
router.get("/",authMiddleware(["admin","super-admin"]), UserController.getAllUser);
router.get("/:id", UserController.getSingleUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/resend-otp", UserController.resendOtp);

export const userRoute = router;
