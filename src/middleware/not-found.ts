import type { RequestHandler } from "express";
import { NOT_FOUND } from "@/lib/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@/lib/http-status-phrases";

const notFound: RequestHandler = (req, res) => {
    return res.status(NOT_FOUND).json({
        status: "error",
        message: NOT_FOUND_MESSAGE,
        errors: [
            {
                method: req.method,
                path: req.originalUrl ?? req.path,
                message: `Endpoint ${req.method} ${req.path} not found`,
            },
        ],
    });
};

export default notFound;
