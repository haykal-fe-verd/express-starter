/**
 * Serve Emoji Favicon Middleware
 * @author Muhammad Haykal
 * @date 2025-12-27
 */

import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Middleware to serve an emoji as favicon.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {string} emoji
 *
 * @returns {RequestHandler}
 */
const serveEmojiFavicon = (emoji: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.path === "/favicon.ico") {
            res.setHeader("Content-Type", "image/svg+xml");
            return res.send(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`
            );
        }
        return next();
    };
};

export default serveEmojiFavicon;
