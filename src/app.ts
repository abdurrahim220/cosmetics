import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./router";
import cron from "node-cron";
import sendWelcomeEmail from "./backendServices/emailServices/sendWelcome";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!!");
});

// backend Services/

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
  sendWelcomeEmail();
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
