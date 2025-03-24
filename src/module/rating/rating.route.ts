import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { ratingController } from "./rating.controller";

const router = Router();

router.post("/:productId", authMiddleware(["buyer"]), ratingController.addOrUpdateRating);

export const ratingRoute = router;
