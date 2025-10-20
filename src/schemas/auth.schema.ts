import { z } from "zod";

// Schema for the registration request body
export const registerSchema = z.object({
  body: z.object({
    email: z.email({
      message: "Must be a valid email address",
    }),

    password: z
      .string({
        message: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),

    firstName: z
      .string({
        message: "First name is required",
      })
      .min(1, "First name cannot be empty"),

    lastName: z
      .string({
        message: "Last name is required",
      })
      .min(1, "Last name cannot be empty"),

    referralCode: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({
      message: "Must be a valid email address",
    }),

    password: z
      .string({
        message: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
