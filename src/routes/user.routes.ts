import { Router } from "express";
import { getDashboard, getMyBooks } from "../controllers/user.controller";
import { Auth } from "../middleware/authMiddleware";

const router = Router();

router.get("/dashboard", Auth, getDashboard);
router.get("/my-books", Auth, getMyBooks);

export default router;
