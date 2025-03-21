import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post('/',UserController.createUser)
router.post("/verify-otp", UserController.verifyOtp);
router.post("/resend-otp", UserController.resendOtp);

export const userRoute=router;