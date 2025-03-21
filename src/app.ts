import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./router";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!!");
});

app.use(notFound);
app.use(globalErrorHandler);
export default app;
