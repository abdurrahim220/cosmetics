import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { wishlistController } from "./wishlist.controller";

const router = Router();

router.post(
  "/add",
  authMiddleware(["buyer"]),
  wishlistController.addToWishlist
);
router.delete(
  "/remove",
  authMiddleware(["buyer"]),
  wishlistController.removeFromWishlist
);
router.get("/", authMiddleware(["buyer"]), wishlistController.getWishlist);

export const wishlistRoute = router;
