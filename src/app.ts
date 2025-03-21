import express, { Request, Response } from "express";
import cors from "cors";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!!");
});

app.use(notFound);
app.use(globalErrorHandler);
export default app;
