# Express Starter

A modern, production-ready Express.js starter template with TypeScript, OpenAPI documentation, Winston logging, Prisma ORM, and Docker support.

## ✨ Features

-   🚀 **Express.js** - Fast, unopinionated web framework
-   📘 **TypeScript** - Full type safety with strict mode
-   📝 **OpenAPI 3.0** - Manual OpenAPI specification with Scalar UI
-   🪵 **Winston Logger** - Structured logging with daily file rotation
-   🗄️ **Prisma ORM** - Type-safe database access with PostgreSQL
-   🐳 **Docker** - Multi-stage builds with docker-compose orchestration
-   🔄 **Auto-reload** - Nodemon with hot-reload in development
-   📋 **Route Registry** - Automatic route documentation in console.table
-   🎯 **Middleware** - HTTP logging, error handling, 404 handler, emoji favicon
-   ✅ **Production Ready** - Health checks, structured logging, error handling

## 🛠️ Tech Stack

-   **Runtime**: Node.js 22
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL 17
-   **ORM**: Prisma
-   **Cache**: Redis
-   **Logger**: Winston
-   **API Docs**: Scalar UI
-   **Mail Testing**: Mailpit
-   **Containerization**: Docker & Docker Compose

## 📦 Quick Start

```bash
# Clone the repository
git clone <repository-url> express-starter
cd express-starter

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit http://localhost:8000 to see your app running! 🎉

## 🚀 Installation

### Prerequisites

-   Node.js v22 or higher
-   npm v10 or higher
-   PostgreSQL 17 (or use Docker)
-   Redis (optional, or use Docker)

### Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Email (optional)
SMTP_HOST=localhost
SMTP_PORT=1025
```

### Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

## 📖 Usage

### Development Mode

```bash
npm run dev
```

The server will start with auto-reload enabled. All registered routes will be displayed in a table:

```
📋 Registered Routes:
┌─────────┬────────────────┬────────┬─────────────────┬──────────────────────────────┐
│ (index) │ Name           │ Method │ Path            │ Description                  │
├─────────┼────────────────┼────────┼─────────────────┼──────────────────────────────┤
│ 0       │ 'home.index'   │ 'GET'  │ '/'             │ 'Display home page...'       │
│ 1       │ 'docs.scalar'  │ 'GET'  │ '/api/docs'     │ 'Interactive API docs...'    │
│ 2       │ 'health.check' │ 'GET'  │ '/api/health'   │ 'Check service health...'    │
│ 3       │ 'openapi.spec' │ 'GET'  │ '/openapi.json' │ 'Get OpenAPI 3.0 spec...'    │
└─────────┴────────────────┴────────┴─────────────────┴──────────────────────────────┘
```

### Production Mode

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Docker

Run the entire stack (app + PostgreSQL + Redis + Mailpit):

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
express-starter/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── application/
│   │   ├── create-app.ts         # Express app factory with OpenAPI
│   │   ├── database.ts           # Prisma database connection
│   │   ├── env.ts                # Environment variables
│   │   ├── logging.ts            # Winston logger configuration
│   │   └── openapi-types.ts      # OpenAPI TypeScript types
│   ├── lib/
│   │   ├── route-utils.ts        # Route registry system
│   │   ├── http-status-codes.ts  # HTTP status code constants
│   │   └── utils.ts              # Utility functions
│   ├── middleware/
│   │   ├── http-logger.ts        # HTTP request logger
│   │   ├── not-found.ts          # 404 error handler
│   │   ├── on-error.ts           # Global error handler
│   │   └── serve-emoji-favicon.ts # Emoji favicon middleware
│   └── routes/
│       ├── index.ts              # Route exports
│       ├── health/               # Health check endpoint
│       └── home/                 # Home page endpoint
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── storage/
│   └── logs/                     # Winston log files
├── .docker/
│   └── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml            # Docker orchestration
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🌐 API Documentation

### Available Endpoints

-   **Home**: `GET /` - HTML home page with navigation links
-   **API Docs**: `GET /api/docs` - Interactive API documentation (Scalar UI)
-   **OpenAPI Spec**: `GET /openapi.json` - OpenAPI 3.0 specification
-   **Health Check**: `GET /api/health` - Service health status

### OpenAPI & Scalar UI

Access the interactive API documentation at http://localhost:8000/api/docs

Features:

-   🔍 Search and filter endpoints
-   📝 Try API requests directly from the browser
-   📋 Copy cURL commands
-   🎨 Beautiful, responsive interface

The OpenAPI specification is manually generated and type-safe, providing full control over API documentation.

## 🔧 Development

### Adding New Routes

1. **Create route module** in `src/routes/{module}/`:

```typescript
// src/routes/users/users.route.ts
import { Router } from "express";
import { registerRoute } from "@/lib/route-utils";
import { addPathToDoc } from "@/application/create-app";

export const usersRoutes = (): Router => {
    const router = Router();

    // Register for console.table display
    registerRoute("users.list", "get", "/api/users", "Get all users");

    // Add OpenAPI documentation
    addPathToDoc("/api/users", {
        get: {
            summary: "Get all users",
            tags: ["Users"],
            responses: {
                "200": {
                    description: "List of users",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: { type: "object" },
                            },
                        },
                    },
                },
            },
        },
    });

    router.get("/api/users", getUsers);

    return router;
};
```

2. **Export from** `src/routes/index.ts`:

```typescript
export { usersRoutes } from "./users/users.index";
```

3. **Register in** `src/main.ts`:

```typescript
app.use(usersRoutes());
```

### Route Naming Convention

Follow the pattern: `{module}.{action}`

Examples:

-   `users.list` - GET /api/users
-   `users.create` - POST /api/users
-   `users.get` - GET /api/users/:id
-   `users.update` - PUT /api/users/:id
-   `users.delete` - DELETE /api/users/:id

### Logging

Use Winston logger throughout the application:

```typescript
import { logger } from "@/application/logging";

logger.info("Information message");
logger.warn("Warning message");
logger.error("Error message", { error });
logger.http("HTTP request");
logger.debug("Debug message");
```

Logs are stored in `storage/logs/` with daily rotation:

-   `app-YYYY-MM-DD.log` - All logs
-   `error-YYYY-MM-DD.log` - Errors only

### Database with Prisma

```typescript
import { prisma } from "@/application/database";

// Create
const user = await prisma.user.create({
    data: { email: "user@example.com", name: "John" },
});

// Read
const users = await prisma.user.findMany();

// Update
await prisma.user.update({
    where: { id: userId },
    data: { name: "Jane" },
});

// Delete
await prisma.user.delete({ where: { id: userId } });
```

#### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database (development only!)
npx prisma migrate reset
```

## 🐳 Docker

### Build Image

```bash
docker build -f .docker/Dockerfile -t express-starter:latest .
```

### Run Container

```bash
docker run -p 8000:8000 --env-file .env express-starter:latest
```

### Docker Compose Services

The `docker-compose.yml` includes:

-   **app** - Express.js application (Node.js 22 Alpine)
-   **db** - PostgreSQL 17 database
-   **redis** - Redis cache server
-   **mail** - Mailpit email testing tool

#### Service Access

-   App: http://localhost:8000
-   API Docs: http://localhost:8000/api/docs
-   Mailpit UI: http://localhost:8025
-   PostgreSQL: localhost:5432
-   Redis: localhost:6379

## 🧪 Scripts

```bash
# Development
npm run dev          # Start with auto-reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build

# Database
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client

# Docker
npm run docker:up    # Start docker-compose
npm run docker:down  # Stop docker-compose
npm run docker:logs  # View logs
```

## 🎯 Best Practices

### Type Safety

Always use TypeScript types and interfaces:

```typescript
import { Request, Response, NextFunction } from "express";

interface UserParams {
    id: string;
}

interface UserBody {
    name: string;
    email: string;
}

export const updateUser = async (req: Request<UserParams, {}, UserBody>, res: Response, next: NextFunction) => {
    // Implementation
};
```

### Error Handling

Use try-catch and let the error middleware handle errors:

```typescript
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        // Error middleware will handle this
        throw error;
    }
};
```

### Input Validation

Use Zod or similar validation library:

```typescript
import { z } from "zod";

const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
});

// Validate before processing
const validatedData = createUserSchema.parse(req.body);
```

## 🔒 Security

-   Environment variables for sensitive data
-   Helmet middleware for security headers (recommended to add)
-   CORS configuration (recommended to add)
-   Rate limiting (recommended to add)
-   Input validation and sanitization
-   Secure password hashing (recommended to add)

## 📚 Documentation

For detailed documentation, see:

-   [How to Use Guide](src/doc/how-to-use.md) - Comprehensive usage guide in Bahasa Indonesia

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [Express.js](https://expressjs.com/) - Web framework
-   [Prisma](https://www.prisma.io/) - Database ORM
-   [Winston](https://github.com/winstonjs/winston) - Logging library
-   [Scalar](https://github.com/scalar/scalar) - API documentation UI
-   [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

For questions, issues, or contributions, please open an issue in the repository.

---

**Built with ❤️ using Express.js and TypeScript**
