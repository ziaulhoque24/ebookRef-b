import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type * as z4 from "zod/v4/core";

export const validate =
  <T extends z4.$ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = (schema as any).safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        throw result.error;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return res
          .status(400)
          .json({ error: "Validation failed", details: errorMessages });
      }
      // Handle other unexpected errors
      return res.status(500).json({ error: "Internal server error" });
    }
  };
