import { Router } from "express";
import { addressController } from "./address.controller";
import authMiddleware from "../../middleware/auth";


const router = Router();

router.post(
  "/",
  
  authMiddleware(["admin", "buyer", "seller"]),
  addressController.addOrUpdateAddress
);

export const addressRoute = router;
