import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { createSuperAdmin } from "./module/Admin/superAdmin";

const connectDB = async () => {
  try {
    await mongoose.connect(config.db);
    createSuperAdmin()
    console.log("📦 Connected to database");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
};

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

connectDB();
