# Express Starter - How to Use

Panduan lengkap untuk menggunakan Express Starter dengan TypeScript, OpenAPI, Winston Logger, Prisma, dan Docker.

## 📋 Table of Contents

-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Running the Project](#running-the-project)
-   [Available Routes](#available-routes)
-   [Project Structure](#project-structure)
-   [Development Workflow](#development-workflow)
-   [Adding New Routes](#adding-new-routes)
-   [Database with Prisma](#database-with-prisma)
-   [Logging](#logging)
-   [Docker Usage](#docker-usage)
-   [API Documentation](#api-documentation)

## Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

-   **Node.js** v22 atau lebih tinggi
-   **npm** v10 atau lebih tinggi
-   **Docker** dan **Docker Compose** (optional, untuk containerization)
-   **PostgreSQL** 17 (jika tidak menggunakan Docker)
-   **Redis** (jika tidak menggunakan Docker)

## Installation

### 1. Clone atau Copy Project

```bash
cd /path/to/your/workspace
# Jika dari git
git clone <repository-url> express-starter
cd express-starter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root project:

```bash
cp .env.example .env  # Jika ada, atau buat manual
```

Isi dengan konfigurasi Anda:

```env
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Email (optional, untuk development)
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Configuration

### Database Setup

1. Pastikan PostgreSQL sudah running
2. Jalankan migrasi Prisma:

```bash
npx prisma migrate dev
```

3. (Optional) Seed database:

```bash
npx prisma db seed
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Running the Project

### Development Mode

Menggunakan nodemon untuk auto-reload:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`

### Production Mode

1. Build project:

```bash
npm run build
```

2. Jalankan:

```bash
npm start
```

### Using Docker

Jalankan seluruh stack (app + database + redis + mailpit):

```bash
docker-compose up -d
```

Stop services:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f app
```

## Available Routes

Saat server dijalankan, semua routes akan ditampilkan di console dengan format tabel:

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

### Default Endpoints

-   **Home**: `GET /` - Halaman HTML dengan navigasi
-   **API Docs**: `GET /api/docs` - Interactive API documentation (Scalar UI)
-   **OpenAPI Spec**: `GET /openapi.json` - OpenAPI 3.0 specification dalam JSON
-   **Health Check**: `GET /api/health` - Status kesehatan service

## Project Structure

```
express-starter/
├── src/
│   ├── main.ts                    # Entry point
│   ├── application/
│   │   ├── create-app.ts         # Express app factory dengan OpenAPI
│   │   ├── database.ts           # Koneksi database Prisma
│   │   ├── env.ts                # Environment variables
│   │   ├── logging.ts            # Winston logger configuration
│   │   └── openapi-types.ts      # TypeScript types untuk OpenAPI
│   ├── doc/                      # Documentation files
│   ├── generated/                # Prisma generated files
│   ├── lib/
│   │   ├── constants.ts          # Global constants
│   │   ├── route-utils.ts        # Route registry system
│   │   ├── http-status-codes.ts  # HTTP status codes
│   │   └── utils.ts              # Helper functions
│   ├── middleware/
│   │   ├── http-logger.ts        # HTTP request logger
│   │   ├── not-found.ts          # 404 handler
│   │   ├── on-error.ts           # Error handler
│   │   └── serve-emoji-favicon.ts # Emoji favicon
│   └── routes/
│       ├── index.ts              # Central route exports
│       ├── health/               # Health check module
│       │   ├── health.handler.ts
│       │   ├── health.route.ts
│       │   ├── health.validation.ts
│       │   └── health.index.ts
│       └── home/                 # Home page module
│           ├── home.handler.ts
│           ├── home.route.ts
│           ├── home.validation.ts
│           └── home.index.ts
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── storage/
│   └── logs/                     # Winston log files
├── docker-compose.yml            # Docker orchestration
├── .docker/
│   └── Dockerfile                # Multi-stage Docker build
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Development Workflow

### 1. Menjalankan Server

```bash
npm run dev
```

### 2. Watch Logs

Logs otomatis tersimpan di `storage/logs/`:

-   `app-YYYY-MM-DD.log` - All logs
-   `error-YYYY-MM-DD.log` - Error only

### 3. Auto-restart

Nodemon akan auto-restart server saat ada perubahan di:

-   `src/**/*.ts`
-   `src/**/*.json`
-   `.env`

### 4. Database Changes

Setelah edit `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

## Adding New Routes

### 1. Buat Module Folder

```bash
mkdir -p src/routes/users
```

### 2. Buat Files

**users.handler.ts** - Handler logic:

```typescript
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
};
```

**users.validation.ts** - Request validation:

```typescript
import { z } from "zod";

export const getUserSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
```

**users.route.ts** - Route definition:

```typescript
import { Router } from "express";
import { getUsers } from "./users.handler";
import { registerRoute } from "@/lib/route-utils";

export const usersRoutes = (): Router => {
    const router = Router();

    // Register route for console.table display
    registerRoute("users.list", "get", "/api/users", "Get all users");

    router.get("/api/users", getUsers);

    return router;
};
```

**users.index.ts** - Module export:

```typescript
export { usersRoutes } from "./users.route";
```

### 3. Register di Central Routes

Edit `src/routes/index.ts`:

```typescript
export { healthRoutes } from "./health/health.index";
export { homeRoutes } from "./home/home.index";
export { usersRoutes } from "./users/users.index"; // Tambahkan ini
```

### 4. Register di Main App

Edit `src/main.ts`:

```typescript
import { healthRoutes, homeRoutes, usersRoutes } from "@/routes";

// ...

app.use(healthRoutes());
app.use(homeRoutes());
app.use(usersRoutes()); // Tambahkan ini
```

### 5. Add to OpenAPI Documentation

Edit route file untuk menambahkan OpenAPI spec:

```typescript
import { addPathToDoc } from "@/application/create-app";

export const usersRoutes = (): Router => {
    const router = Router();

    registerRoute("users.list", "get", "/api/users", "Get all users");

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
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                        email: { type: "string" },
                                    },
                                },
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

## Database with Prisma

### Schema Definition

Edit `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Create Migration

```bash
npx prisma migrate dev --name add_user_model
```

### Use in Code

```typescript
import { prisma } from "@/application/database";

// Create
const user = await prisma.user.create({
    data: {
        email: "user@example.com",
        name: "John Doe",
    },
});

// Read
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({
    where: { id: "uuid" },
});

// Update
const updated = await prisma.user.update({
    where: { id: "uuid" },
    data: { name: "Jane Doe" },
});

// Delete
await prisma.user.delete({
    where: { id: "uuid" },
});
```

### Prisma Studio

Open visual database editor:

```bash
npx prisma studio
```

## Logging

### Using Winston Logger

Import logger:

```typescript
import { logger } from "@/application/logging";

// Log levels
logger.error("Error message");
logger.warn("Warning message");
logger.info("Info message");
logger.http("HTTP request");
logger.debug("Debug message");
```

### Log Files

Logs disimpan di `storage/logs/`:

-   Rotasi harian
-   Max 14 hari
-   Format: `YYYY-MM-DD HH:mm:ss.SSS [LEVEL] message`

### HTTP Request Logging

Semua HTTP request otomatis ter-log dengan format:

```
[2025-12-26 22:41:23.257] HTTP GET / 200 45ms
```

Sensitive data (password, token) otomatis di-mask.

## Docker Usage

### Build Image

```bash
docker build -f .docker/Dockerfile -t express-starter:latest .
```

### Run Container

```bash
docker run -p 8000:8000 --env-file .env express-starter:latest
```

### Docker Compose Services

```yaml
services:
  app      # Node.js Express application
  db       # PostgreSQL 17
  redis    # Redis cache
  mail     # Mailpit for email testing
```

### Access Services

-   **App**: http://localhost:8000
-   **API Docs**: http://localhost:8000/api/docs
-   **Mailpit UI**: http://localhost:8025
-   **PostgreSQL**: localhost:5432
-   **Redis**: localhost:6379

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Database Management in Docker

```bash
# Run migrations
docker-compose exec app npx prisma migrate dev

# Prisma Studio
docker-compose exec app npx prisma studio

# Access database directly
docker-compose exec db psql -U postgres -d express-starter
```

## API Documentation

### OpenAPI Specification

OpenAPI spec tersedia di:

-   **JSON**: http://localhost:8000/openapi.json
-   **Interactive UI**: http://localhost:8000/api/docs

### Scalar UI Features

-   🔍 Search endpoints
-   📝 Try API directly from browser
-   📋 Copy cURL commands
-   🎨 Beautiful, interactive interface

### Adding API Documentation

Gunakan `addPathToDoc()` di route files:

```typescript
import { addPathToDoc } from "@/application/create-app";

addPathToDoc("/api/endpoint", {
    get: {
        summary: "Endpoint summary",
        description: "Detailed description",
        tags: ["Tag Name"],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            "200": {
                description: "Success response",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                message: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    },
});
```

## Best Practices

### 1. Route Naming Convention

Format: `{module}.{action}`

Examples:

-   `users.list` - GET /api/users
-   `users.create` - POST /api/users
-   `users.get` - GET /api/users/:id
-   `users.update` - PUT /api/users/:id
-   `users.delete` - DELETE /api/users/:id

### 2. Error Handling

Gunakan `try-catch` dan throw error dengan status code:

```typescript
import { NotFoundError, ValidationError } from "@/lib/utils";

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        res.json(user);
    } catch (error) {
        // Error middleware will handle this
        throw error;
    }
};
```

### 3. Type Safety

Selalu gunakan TypeScript types:

```typescript
import { Request, Response, NextFunction } from "express";

interface UserRequest extends Request {
    params: {
        id: string;
    };
    body: {
        name: string;
        email: string;
    };
}

export const updateUser = async (req: UserRequest, res: Response, next: NextFunction) => {
    // Implementation
};
```

### 4. Validation

Gunakan Zod untuk validasi:

```typescript
import { z } from "zod";

const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        email: z.string().email(),
    }),
});

// Middleware
const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req);
            next();
        } catch (error) {
            res.status(400).json({ error: "Validation failed" });
        }
    };
};

// Usage
router.post("/users", validate(createUserSchema), createUser);
```

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -ti:8000

# Kill process
kill -9 $(lsof -ti:8000)
```

### Database Connection Error

1. Check `.env` DATABASE_URL
2. Ensure PostgreSQL is running
3. Run migrations: `npx prisma migrate dev`

### Prisma Generate Error

```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

### Docker Issues

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Additional Resources

-   [Express.js Documentation](https://expressjs.com/)
-   [Prisma Documentation](https://www.prisma.io/docs)
-   [Winston Logger](https://github.com/winstonjs/winston)
-   [OpenAPI Specification](https://swagger.io/specification/)
-   [Scalar API Reference](https://github.com/scalar/scalar)

## Support

Untuk pertanyaan atau issues, buka issue di repository project ini.

---

**Happy Coding! 🚀**
