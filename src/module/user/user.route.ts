import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getSingleUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.patch("/verify-otp", UserController.verifyOtp);
router.patch("/resend-otp", UserController.resendOtp);

export const userRoute = router;
