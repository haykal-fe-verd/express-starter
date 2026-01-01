/** biome-ignore-all lint/correctness/noUnusedVariables: <Global type> */
import type { z } from "zod";
import "express-serve-static-core";

declare module "express-serve-static-core" {
    namespace Express {
        interface Request {
            validated?: {
                body?: z.infer<z.ZodTypeAny>;
                query?: z.infer<z.ZodTypeAny>;
                params?: z.infer<z.ZodTypeAny>;
                headers?: z.infer<z.ZodTypeAny>;
            };
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}
