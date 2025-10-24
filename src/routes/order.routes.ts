import { Router } from "express";
import { createOrder, getOrders } from "../controllers/order.controller";
import { Auth } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, getOrdersSchema } from "../schemas/order.schema";

const router = Router();

router.post("/", Auth, validate(createOrderSchema), createOrder);
router.get("/", Auth, validate(getOrdersSchema), getOrders);

export default router;
