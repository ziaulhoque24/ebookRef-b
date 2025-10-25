import { Router } from "express";
import { getBook, getBooks } from "../controllers/book.controller";
import { OptionalAuth } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate.middleware";
import { getBooksSchema } from "../schemas/book.schema";

const router = Router();

router.get("/", OptionalAuth, validate(getBooksSchema), getBooks);
router.get("/:id", OptionalAuth, getBook);

export default router;
