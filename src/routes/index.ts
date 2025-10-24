import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./book.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/user", userRoutes);

export default router;
