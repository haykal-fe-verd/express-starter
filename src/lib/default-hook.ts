import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";

/**
 * Validation middleware for Express using Zod schemas.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(UNPROCESSABLE_ENTITY).json({
                success: false,
                error: {
                    name: error.name,
                    issues: error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                        code: issue.code,
                    })),
                },
            });
        }
        return next(error);
    }
};

export default validate;
