import { config } from "../../config";
import { User } from "../user/user.model";

export const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({
      role: config.SUPER_ADMIN_ROLE,
    });
    if (existingSuperAdmin) {
      console.log("Super Admin already exists");
      return;
    }
    const superAdmin = new User({
      name: config.SUPER_ADMIN_NAME,
      email: config.SUPER_ADMIN_EMAIL,
      password: config.SUPER_ADMIN_PASSWORD,
      image: config.SUPER_ADMIN_IMAGE,
      role: config.SUPER_ADMIN_ROLE,
      status: "active",
      isVerified: true,
      isDeleted: false,
    });
    await User.create(superAdmin);
    console.log("🎉 Super admin created successfully");
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  }
};
