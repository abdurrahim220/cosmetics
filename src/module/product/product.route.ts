import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { productController } from "./product.controller";

const router = Router();

router.post(
  "/",
  authMiddleware(["seller"]),
  productController.createOrUpdateProduct
);

router.delete(
  "/",
  authMiddleware(["admin", "seller"]),
  productController.deleteProduct
);

router.get("/:productId", productController.getSingleProduct);


router.get("/", productController.getAllProducts);

router.get(
  "/seller/products",
  authMiddleware(["seller"]),
  productController.getSellerProducts
);

export const productRoute = router;
