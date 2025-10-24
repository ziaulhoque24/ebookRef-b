import { z } from "zod";

export const getBooksSchema = z.object({
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

export type GetBooksQuery = z.infer<typeof getBooksSchema>["query"];
