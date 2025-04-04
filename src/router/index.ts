import { Router } from "express";
import { authRoute } from "../module/auth/auth.route";
import { userRoute } from "../module/user/user.route";
import { productRoute } from "../module/product/product.route";
import { orderRoute } from "../module/order/order.route";
import { bannerRoute } from "../module/banner/banner.route";
import { addressRoute } from "../module/address/address.route";
import { ratingRoute } from "../module/rating/rating.route";
import { wishlistRoute } from "../module/wishlist/wishlist.route";
import { adminRoute } from "../module/Admin/adminRoute";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    router: authRoute,
  },
  {
    path: "/user",
    router: userRoute,
  },
  {
    path: "/admin",
    router: adminRoute,
  },
  {
    path: "/product",
    router: productRoute,
  },
  {
    path: "/order",
    router: orderRoute,
  },
  {
    path: "/wishlist",
    router: wishlistRoute,
  },
  {
    path: "/banner",
    router: bannerRoute,
  },
  {
    path: "/address",
    router: addressRoute,
  },
  {
    path: "/rating",
    router: ratingRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
