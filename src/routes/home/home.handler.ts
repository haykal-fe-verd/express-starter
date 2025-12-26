import { Request, Response } from "express";
import { OK } from "@/lib/http-status-codes";
import packageJSON from "../../../package.json";

/**
 * Home page handler.
 * @author Muhammad Haykal
 * @date 2025-12-26
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Response} HTML response
 */
export const homeHandler = (_req: Request, res: Response) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Express Starter - Home</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
            }
            .container {
                text-align: center;
                padding: 2rem;
                max-width: 600px;
            }
            .logo {
                font-size: 5rem;
                margin-bottom: 1rem;
                animation: bounce 2s infinite;
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 0.5rem;
                font-weight: 700;
            }
            .version {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-bottom: 1rem;
            }
            .description {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                opacity: 0.95;
            }
            .buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            .btn {
                display: inline-block;
                padding: 1rem 2rem;
                font-size: 1rem;
                font-weight: 600;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s ease;
                cursor: pointer;
                border: none;
            }
            .btn-primary {
                background: #fff;
                color: #667eea;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            .btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
                backdrop-filter: blur(10px);
            }
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
            .features {
                margin-top: 3rem;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
                text-align: center;
            }
            .feature {
                background: rgba(255, 255, 255, 0.1);
                padding: 1.5rem;
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }
            .feature-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            .feature-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            .feature-desc {
                font-size: 0.9rem;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🚀</div>
            <h1>${packageJSON.name}</h1>
            <p class="version">v${packageJSON.version}</p>
            <p class="description">${packageJSON.description}</p>

            <div class="buttons">
                <a href="/api/docs" class="btn btn-primary">📚 API Documentation</a>
                <a href="/api/health" class="btn btn-secondary">🔍 Health Check</a>
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-title">Fast</div>
                    <div class="feature-desc">Built with Express</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-title">TypeSafe</div>
                    <div class="feature-desc">Full TypeScript</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📖</div>
                    <div class="feature-title">Documented</div>
                    <div class="feature-desc">OpenAPI 3.0</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    return res.status(OK).send(html);
};
