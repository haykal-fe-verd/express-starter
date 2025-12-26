import { NOT_FOUND } from "@/lib/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@/lib/http-status-phrases";
import { RequestHandler } from "express";

/**
 * Middleware to handle 404 Not Found errors.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Response}
 */
const notFound: RequestHandler = (req, res) => {
    return res.status(NOT_FOUND).json({
        message: `${NOT_FOUND_MESSAGE} - ${req.path}`,
    });
};

export default notFound;
