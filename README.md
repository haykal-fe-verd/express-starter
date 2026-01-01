# ⚡ Express Starter Template

<div align="center">

![Homepage](docs/homepage.png)

**A production-ready Express.js REST API starter template with TypeScript, JWT authentication, role-based access control (RBAC), Prisma ORM, Redis caching, and comprehensive OpenAPI documentation.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748.svg)](https://www.prisma.io/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [License](#-license)

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization

-   **JWT Authentication** - Secure access and refresh token system
-   **Role-Based Access Control (RBAC)** - Flexible permission management
-   **Password Security** - Bcrypt hashing with salt rounds
-   **Token Refresh** - Automatic token renewal mechanism

### 🗄️ Database & ORM

-   **Prisma ORM** - Type-safe database queries
-   **PostgreSQL** - Powerful relational database
-   **Database Migrations** - Version control for your schema
-   **Seeding** - Pre-populate database with test data

### ⚡ Performance & Caching

-   **Redis Cache** - Lightning-fast data caching layer
-   **Response Compression** - Gzip compression for responses
-   **Rate Limiting** - Protect API from abuse
-   **Connection Pooling** - Optimized database connections

### 📚 API Documentation

-   **OpenAPI 3.0** - Industry-standard API specification
-   **Scalar UI** - Beautiful interactive API documentation
-   **Auto-generated** - Docs generated from code
-   **Type-safe schemas** - Zod validation schemas

### 🛠️ Developer Experience

-   **TypeScript** - Full type safety and IntelliSense
-   **Hot Reload** - Instant feedback with Nodemon
-   **Biome** - Fast linting and formatting
-   **Docker Support** - Containerized development environment
-   **Structured Logging** - Winston logger with rotation

### ✅ Validation & Error Handling

-   **Zod Validation** - Runtime type checking
-   **Global Error Handler** - Consistent error responses
-   **Custom HTTP Exceptions** - Meaningful error messages
-   **Request Validation** - Automatic input sanitization

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v22 or higher)
-   **pnpm** (v9 or higher)
-   **Docker** & **Docker Compose** (for PostgreSQL & Redis)
-   **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/haykal-fe-verd/express-starter.git
cd express-starter
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables:

```env
# APP
NODE_ENV=development
PORT=8000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# DATABASE
POSTGRES_USER=express-starter
POSTGRES_PASSWORD=express-starter
POSTGRES_DB=express-starter
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"

# REDIS
REDIS_URL=redis://localhost:6379
```

4. **Start PostgreSQL and Redis with Docker**

```bash
docker-compose up -d
```

5. **Generate Prisma Client**

```bash
pnpm db:generate
```

6. **Run database migrations**

```bash
pnpm db:migrate
```

7. **Seed the database** (optional)

```bash
pnpm db:seed
```

8. **Start the development server**

```bash
pnpm dev
```

The API will be available at `http://localhost:8000`

---

## 📖 Documentation

### Interactive API Documentation

Once the server is running, visit:

-   **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
-   **Landing Page**: [http://localhost:8000/](http://localhost:8000/)

![API Documentation](docs/docs.png)

### Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Start development server with hot reload |
| `pnpm build`       | Build for production                     |
| `pnpm start`       | Start production server                  |
| `pnpm db:generate` | Generate Prisma Client                   |
| `pnpm db:migrate`  | Run database migrations                  |
| `pnpm db:push`     | Push schema changes to database          |
| `pnpm db:seed`     | Seed database with test data             |
| `pnpm db:studio`   | Open Prisma Studio GUI                   |
| `pnpm format`      | Format code with Biome                   |
| `pnpm lint`        | Lint code with Biome                     |

### API Endpoints

#### Authentication

-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - Login user
-   `POST /api/auth/refresh` - Refresh access token
-   `POST /api/auth/logout` - Logout user
-   `GET /api/auth/me` - Get current user

#### Users Management

-   `GET /api/users` - Get all users (paginated)
-   `GET /api/users/:id` - Get user by ID
-   `POST /api/users` - Create new user
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Delete user

#### Roles & Permissions

-   `GET /api/roles` - Get all roles
-   `POST /api/roles` - Create role
-   `PUT /api/roles/:id` - Update role
-   `DELETE /api/roles/:id` - Delete role
-   `GET /api/permissions` - Get all permissions
-   `POST /api/permissions` - Create permission

---

## 🏗️ Project Structure

```
express-starter/
├── docs/                    # Documentation assets
├── prisma/                  # Prisma schema and migrations
│   ├── migrations/          # Database migration files
│   ├── factory/             # Database seeders
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts              # Seed script
├── src/
│   ├── application/         # Application setup
│   │   ├── database.ts      # Prisma client
│   │   ├── env.ts           # Environment validation
│   │   ├── logging.ts       # Winston logger
│   │   ├── redis.ts         # Redis client
│   │   ├── route.ts         # Route registration
│   │   └── scalar.ts        # API documentation
│   ├── generated/           # Generated Prisma client
│   ├── lib/                 # Utility functions
│   │   ├── constants.ts     # App constants
│   │   ├── http-status-codes.ts
│   │   ├── http-status-phrases.ts
│   │   ├── open-api.ts      # OpenAPI helpers
│   │   └── route-utils.ts   # Route utilities
│   ├── middleware/          # Express middleware
│   │   ├── http-logger.ts   # Request logging
│   │   ├── not-found.ts     # 404 handler
│   │   ├── on-error.ts      # Error handler
│   │   ├── rate-limit.ts    # Rate limiting
│   │   └── serve-emoji-favicon.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── home/            # Landing page
│   │   ├── health/          # Health check
│   │   ├── users/           # User management
│   │   ├── roles/           # Role management
│   │   └── permissions/     # Permission management
│   ├── types/               # TypeScript types
│   └── main.ts              # Application entry point
├── storage/logs/            # Application logs
├── .env                     # Environment variables
├── .env.example             # Environment template
├── docker-compose.yml       # Docker services
├── nodemon.json             # Nodemon configuration
├── tsconfig.json            # TypeScript configuration
├── biome.json               # Biome configuration
└── package.json             # Dependencies
```

### Module Structure

Each module follows a consistent structure:

```
module/
├── module.controller.ts     # HTTP request handlers
├── module.service.ts        # Business logic
├── module.route.ts          # Route definitions
└── module.validation.ts     # Zod schemas
```

---

## 🛠️ Tech Stack

### Core

-   **[Express.js](https://expressjs.com/)** - Fast, minimalist web framework
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
-   **[Node.js](https://nodejs.org/)** - JavaScript runtime

### Database & ORM

-   **[Prisma](https://www.prisma.io/)** - Next-generation ORM
-   **[PostgreSQL](https://www.postgresql.org/)** - Relational database
-   **[Redis](https://redis.io/)** - In-memory data store

### Authentication & Security

-   **[JWT](https://jwt.io/)** - JSON Web Tokens
-   **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
-   **[Helmet](https://helmetjs.github.io/)** - Security headers
-   **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing

### Validation & Documentation

-   **[Zod](https://zod.dev/)** - Schema validation
-   **[Scalar](https://github.com/scalar/scalar)** - API documentation
-   **[OpenAPI](https://www.openapis.org/)** - API specification

### Development Tools

-   **[Nodemon](https://nodemon.io/)** - Auto-reload
-   **[Biome](https://biomejs.dev/)** - Linter & formatter
-   **[Docker](https://www.docker.com/)** - Containerization
-   **[Winston](https://github.com/winstonjs/winston)** - Logging

---

## 🐳 Docker Setup

The project includes Docker Compose configuration for PostgreSQL and Redis:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Services

-   **PostgreSQL**: `localhost:5432`
-   **Redis**: `localhost:6379`

---

## 🔧 Configuration

### Environment Variables

| Variable                 | Description                          | Default     |
| ------------------------ | ------------------------------------ | ----------- |
| `NODE_ENV`               | Environment (development/production) | development |
| `PORT`                   | Server port                          | 8000        |
| `LOG_LEVEL`              | Logging level                        | debug       |
| `JWT_SECRET`             | JWT signing secret                   | -           |
| `JWT_EXPIRES_IN`         | Access token expiry                  | 7d          |
| `JWT_REFRESH_SECRET`     | Refresh token secret                 | -           |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry                 | 30d         |
| `DATABASE_URL`           | PostgreSQL connection string         | -           |
| `REDIS_URL`              | Redis connection string              | -           |

### Database Configuration

Prisma schema is located at `prisma/schema.prisma`. Modify the schema and run migrations:

```bash
# Create migration
pnpm db:migrate

# Apply migrations
pnpm db:migrate:deploy

# Reset database
pnpm db:migrate:reset
```

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

---

## 🚀 Deployment

### Build for Production

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Update JWT secrets with strong random values
3. Configure production database URL
4. Set up Redis instance
5. Configure CORS allowed origins
6. Set appropriate log level

### Recommended Platforms

-   **[Railway](https://railway.app/)** - Easy deployment with PostgreSQL & Redis
-   **[Render](https://render.com/)** - Free tier available
-   **[Heroku](https://heroku.com/)** - Classic PaaS
-   **[DigitalOcean](https://www.digitalocean.com/)** - App Platform
-   **[AWS](https://aws.amazon.com/)** - EC2, ECS, or Elastic Beanstalk
-   **[Google Cloud](https://cloud.google.com/)** - Cloud Run or App Engine

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

-   Follow TypeScript best practices
-   Use Biome for linting and formatting
-   Write meaningful commit messages
-   Add JSDoc comments for functions
-   Include validation schemas for new endpoints

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Muhammad Haykal**

-   GitHub: [@haykal-fe-verd](https://github.com/haykal-fe-verd)
-   Email: muhammadhaykall99@gmail.com

---

## 🙏 Acknowledgments

-   Express.js team for the amazing framework
-   Prisma team for the excellent ORM
-   All open-source contributors

---

## 📧 Support

If you have any questions or need help, please:

-   Open an [issue](https://github.com/haykal-fe-verd/express-starter/issues)
-   Email: muhammadhaykall99@gmail.com

---

<div align="center">

**[⬆ back to top](#-express-starter-template)**

Made with ❤️ by [Muhammad Haykal](https://github.com/haykal-fe-verd)

</div>
