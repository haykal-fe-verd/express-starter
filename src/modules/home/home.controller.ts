/**
 * Home Controller Module
 * @description Handles HTTP requests for home/landing page
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import type { Request, Response } from "express";

/**
 * Landing page controller
 * @description Renders the landing page with starter template information
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {void} HTML response with landing page
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
export const index = (_req: Request, res: Response) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Express Starter Template - Modern REST API</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #8b5cf6;
            --accent: #ec4899;
            --dark: #0f172a;
            --dark-light: #1e293b;
            --text: #cbd5e1;
            --text-dark: #94a3b8;
            --success: #10b981;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--dark);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .animated-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
            overflow: hidden;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 1;
        }

        .navbar {
            padding: 24px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: fadeInDown 0.6s ease-out;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-links {
            display: flex;
            gap: 32px;
            align-items: center;
        }

        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: white;
        }

        .hero {
            text-align: center;
            padding: 120px 20px 80px;
            animation: fadeInUp 0.8s ease-out;
        }

        .hero-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 50px;
            color: var(--primary);
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 32px;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .hero h1 {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #fff 0%, var(--text) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: clamp(1.125rem, 2vw, 1.375rem);
            color: var(--text-dark);
            max-width: 700px;
            margin: 0 auto 48px;
            line-height: 1.8;
        }

        .gradient-text {
            background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .btn-white {
            background: white;
            color: var(--primary);
        }

        .btn-white:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .features {
            padding: 80px 0;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
            margin-top: 48px;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-card:hover::before {
            transform: scaleX(1);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            display: inline-block;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .feature-card h3 {
            font-size: 1.375rem;
            font-weight: 700;
            margin-bottom: 16px;
            color: white;
        }

        .feature-card ul {
            list-style: none;
            padding: 0;
        }

        .feature-card li {
            padding: 10px 0;
            padding-left: 28px;
            position: relative;
            color: var(--text-dark);
            font-size: 0.95rem;
        }

        .feature-card li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--success);
            font-weight: 700;
            font-size: 1.1rem;
        }

        .stats {
            padding: 60px 0;
            text-align: center;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }

        .stat-card {
            padding: 32px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }

        .stat-label {
            color: var(--text-dark);
            font-size: 0.95rem;
        }

        .tech-stack {
            padding: 60px 0;
            text-align: center;
        }

        .tech-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
            margin-top: 40px;
        }

        .tech-badge {
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text);
            transition: all 0.3s ease;
        }

        .tech-badge:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
        }

        .section-title {
            text-align: center;
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: 16px;
            color: white;
        }

        .section-subtitle {
            text-align: center;
            color: var(--text-dark);
            font-size: 1.125rem;
            max-width: 600px;
            margin: 0 auto;
        }

        .cta-section {
            padding: 100px 0;
            text-align: center;
        }

        .cta-box {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 24px;
            padding: 80px 40px;
            position: relative;
            overflow: hidden;
        }

        .cta-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
        }

        .cta-box h2 {
            font-size: clamp(2rem, 4vw, 2.75rem);
            font-weight: 800;
            color: white;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .cta-box p {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
        }

        .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .footer {
            padding: 60px 0 40px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            margin-top: 80px;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 32px;
        }

        .footer-links {
            display: flex;
            gap: 32px;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: var(--text-dark);
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.3s ease;
        }

        .footer-links a:hover {
            color: white;
        }

        .footer-bottom {
            color: var(--text-dark);
            font-size: 0.9rem;
        }

        .footer-bottom a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }

        .footer-bottom a:hover {
            text-decoration: underline;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .nav-links {
                gap: 16px;
            }

            .nav-links a {
                font-size: 0.85rem;
            }

            .hero {
                padding: 80px 20px 60px;
            }

            .features-grid,
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .feature-card {
                padding: 24px;
            }

            .cta-box {
                padding: 60px 24px;
            }

            .footer-content {
                flex-direction: column;
                text-align: center;
            }

            .footer-links {
                flex-direction: column;
                gap: 16px;
            }
        }

        @media (max-width: 480px) {
            .hero-buttons,
            .cta-buttons {
                flex-direction: column;
                width: 100%;
            }

            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="animated-bg"></div>

    <div class="container">
        <nav class="navbar">
            <div class="logo">⚡ Express API</div>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#tech">Tech Stack</a>
                <a href="/docs">Docs</a>
                <a href="https://github.com/haykal-fe-verd/express-starter" target="_blank">GitHub</a>
            </div>
        </nav>

        <section class="hero">
            <div class="hero-badge">✨ Production Ready</div>
            <h1>
                Build Modern APIs with<br>
                <span class="gradient-text">Express & TypeScript</span>
            </h1>
            <p>A feature-rich REST API starter template with JWT authentication, RBAC, Prisma ORM, Redis caching, and comprehensive OpenAPI documentation</p>
            <div class="hero-buttons">
                <a href="/docs" class="btn btn-primary">📖 View Documentation</a>
                <a href="https://github.com/haykal-fe-verd/express-starter" class="btn btn-secondary" target="_blank">⭐ Star on GitHub</a>
            </div>
        </section>

        <section class="features" id="features">
            <h2 class="section-title">Powerful Features</h2>
            <p class="section-subtitle">Everything you need to build production-ready REST APIs</p>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔐</div>
                    <h3>Authentication & Security</h3>
                    <ul>
                        <li>JWT access & refresh tokens</li>
                        <li>Role-Based Access Control</li>
                        <li>Permission middleware</li>
                        <li>Secure password hashing</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🗄️</div>
                    <h3>Database & ORM</h3>
                    <ul>
                        <li>Prisma ORM integration</li>
                        <li>PostgreSQL support</li>
                        <li>Type-safe queries</li>
                        <li>Migrations & seeding</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>High Performance</h3>
                    <ul>
                        <li>Redis caching layer</li>
                        <li>Response compression</li>
                        <li>Smart rate limiting</li>
                        <li>Optimized queries</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">📚</div>
                    <h3>API Documentation</h3>
                    <ul>
                        <li>OpenAPI 3.0 specs</li>
                        <li>Scalar interactive UI</li>
                        <li>Auto-generated docs</li>
                        <li>Request/response examples</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">✅</div>
                    <h3>Validation & Type Safety</h3>
                    <ul>
                        <li>Zod schema validation</li>
                        <li>Full TypeScript support</li>
                        <li>Runtime type checking</li>
                        <li>Error handling</li>
                    </ul>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">🛠️</div>
                    <h3>Developer Experience</h3>
                    <ul>
                        <li>Hot reload development</li>
                        <li>Biome linting & format</li>
                        <li>Docker Compose setup</li>
                        <li>Structured logging</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="tech-stack" id="tech">
            <h2 class="section-title">Modern Tech Stack</h2>
            <p class="section-subtitle">Built with industry-leading technologies and best practices</p>

            <div class="tech-grid">
                <span class="tech-badge">Express.js</span>
                <span class="tech-badge">TypeScript</span>
                <span class="tech-badge">Prisma ORM</span>
                <span class="tech-badge">PostgreSQL</span>
                <span class="tech-badge">Redis</span>
                <span class="tech-badge">JWT</span>
                <span class="tech-badge">Zod</span>
                <span class="tech-badge">Bcrypt</span>
                <span class="tech-badge">Docker</span>
                <span class="tech-badge">Scalar API</span>
                <span class="tech-badge">Winston</span>
                <span class="tech-badge">Nodemon</span>
            </div>
        </section>

        <section class="cta-section">
            <div class="cta-box">
                <h2>Ready to Start Building?</h2>
                <p>Get started with the most complete Express.js starter template</p>
                <div class="cta-buttons">
                    <a href="/docs" class="btn btn-white">📖 Read Documentation</a>
                    <a href="/health" class="btn btn-secondary">✓ Check Health</a>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="footer-content">
                <div class="logo">⚡ Express API</div>
                <div class="footer-links">
                    <a href="/docs">Documentation</a>
                    <a href="/health">Health Check</a>
                    <a href="https://github.com/haykal-fe-verd/express-starter" target="_blank">GitHub</a>
                    <a href="https://github.com/haykal-fe-verd" target="_blank">Author</a>
                </div>
            </div>
            <div class="footer-bottom">
                Built with ❤️ by <a href="https://github.com/haykal-fe-verd" target="_blank">Muhammad Haykal</a> • Licensed under MIT • © 2026
            </div>
        </footer>
    </div>
</body>
</html>
	`.trim();

    res.setHeader("Content-Type", "text/html");
    res.send(html);
};
