import { Router } from "express";
import { getDashboard } from "../controllers/user.controller";
import { Auth } from "../middleware/authMiddleware";

const router = Router();

router.get("/dashboard", Auth, getDashboard);

export default router;
