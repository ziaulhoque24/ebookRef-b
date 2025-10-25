import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mainRouter from "./routes/index";

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT) || 4001;

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api", mainRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server running on http://0.0.0.0:${PORT}`);
});
