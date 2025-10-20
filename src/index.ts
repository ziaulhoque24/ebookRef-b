import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mainRouter from "./routes/index";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
