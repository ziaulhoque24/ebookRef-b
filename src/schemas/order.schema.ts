import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    ebookIds: z
      .array(z.string().min(1, "Ebook ID is required"))
      .min(1, "At least one ebook is required"),
    creditsToUse: z
      .number()
      .min(0, "Credits to use cannot be negative")
      .default(0),
  }),
});

export const getOrdersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .refine((val) => val >= 1, "Page must be at least 1"),
    count: z
      .string()
      .optional()
      .default("10")
      .transform(Number)
      .refine(
        (val) => val >= 1 && val <= 100,
        "Count must be between 1 and 100"
      ),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type GetOrdersQuery = z.infer<typeof getOrdersSchema>["query"];
