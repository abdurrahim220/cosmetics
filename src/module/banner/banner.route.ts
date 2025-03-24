import { Router } from "express";
import { bannerController } from "./banner.controller";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.post("/", authMiddleware(["admin"]), bannerController.createBanner);
router.put("/:id",authMiddleware(["admin"]),bannerController.updateBanner);
router.delete("/delete/:id", authMiddleware(["admin"]),bannerController.deleteBanner);
router.get("/random", bannerController.getRandomBanner);
router.get("/", bannerController.getAllBanner);

export const bannerRoute = router;
