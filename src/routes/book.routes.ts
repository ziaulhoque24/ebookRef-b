import { Router } from "express";
import { getBooks } from "../controllers/book.controller";
import { validate } from "../middleware/validate.middleware";
import { getBooksSchema } from "../schemas/book.schema";

const router = Router();

router.get("/", validate(getBooksSchema), getBooks);

export default router;
