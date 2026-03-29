# Small Social Media Project - Copilot Instructions

## Project Overview
A full-stack social media application with user authentication, post creation, and engagement features. Built with modern TypeScript, React, Node.js, and PostgreSQL.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js (v5.2.1)
- **Language**: TypeScript 6.0.2
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: Prisma 7.5.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs 3.0.3
- **File Storage**: Cloudinary
- **File Upload**: Multer 2.1.1
- **Validation**: Zod 4.3.6
- **Development**: tsx, ts-node, nodemon

### Frontend
- **Framework**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 8.0.1
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router 7.13.2
- **HTTP Client**: Axios 1.13.6
- **Development**: ESLint

### Infrastructure
- **Containerization**: Docker Compose
- **Database Container**: PostgreSQL 16 Alpine (localhost:5432)

---

## Project Structure

```
small-social-media-2/
├── backend/                      # Node.js/Express backend
│   ├── src/
│   │   ├── app.ts               # Express app setup (routes, middleware)
│   │   ├── server.ts            # Server entry point
│   │   ├── config/              # Configuration files
│   │   │   ├── cloudinary.ts    # Cloudinary setup
│   │   │   ├── multer.ts        # File upload configuration
│   │   │   └── prisma.ts        # Prisma client instance
│   │   ├── controllers/          # Request handlers
│   │   │   ├── user.controller.ts
│   │   │   └── post.controller.ts
│   │   ├── services/             # Business logic layer
│   │   │   ├── user.service.ts
│   │   │   └── post.service.ts
│   │   ├── routes/               # API route definitions
│   │   │   ├── user.routes.ts
│   │   │   └── post.routes.ts
│   │   ├── middlewares/          # Express middlewares
│   │   │   ├── auth.middleware.ts # JWT verification
│   │   │   └── upload.middleware.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── auth.types.ts
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   └── user.dto.ts
│   │   ├── validations/          # Zod validation schemas
│   │   │   ├── user.validation.ts
│   │   │   └── post.validation.ts
│   │   ├── utils/
│   │   │   └── uploadToCloudinary.ts
│   │   └── tools/
│   │       └── debug.tool.ts
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma.config.ts
├── frontend/                     # React/Vite frontend
│   ├── src/
│   │   ├── App.tsx              # Main app component with routes
│   │   ├── main.tsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   ├── app/
│   │   │   ├── store.ts         # Redux store configuration
│   │   │   └── hooks.ts         # Custom Redux hooks
│   │   ├── components/
│   │   │   ├── SideBar.tsx
│   │   │   └── icons/           # Icon components
│   │   ├── features/            # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── loginSlice.ts     # Redux slice for auth
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useLogin.ts
│   │   │   │   └── types/
│   │   │   │       ├── FormData.ts
│   │   │   │       ├── login.ts
│   │   │   │       └── register.ts
│   │   │   ├── page/
│   │   │   │   ├── Home.tsx
│   │   │   │   └── About.tsx
│   │   │   ├── posts/
│   │   │   │   ├── PostPage.tsx
│   │   │   │   ├── MyPostPage.tsx
│   │   │   │   ├── postSlice.ts      # Redux slice for posts
│   │   │   │   ├── components/
│   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   └── PostGrid.tsx
│   │   │   │   └── types/
│   │   │   │       └── post.ts
│   │   │   └── profile/
│   │   │       ├── Profile.tsx
│   │   │       ├── profileSlice.ts   # Redux slice for profile
│   │   │       └── types/
│   │   │           └── profile.ts
│   │   ├── libs/
│   │   │   └── axios.ts         # Axios instance configuration
│   │   ├── types/
│   │   │   └── auth.ts
│   │   └── prompts/             # AI assistant prompts
│   │       ├── api_call_style.prompt.md
│   │       └── ui_style_skill.prompt.md
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── index.html
├── docker-compose.yml           # Docker services configuration
└── .github/
    └── copilot-instructions.md  # This file
```

---

## Architecture Patterns

### Backend Architecture (Controller → Service → Repository Pattern)

1. **Controllers** (`src/controllers/`)
   - Handle HTTP requests and responses
   - Input validation using Zod schemas
   - Call service layer for business logic
   - Return appropriate status codes and JSON responses

   ```typescript
   // Pattern: Validate → Call Service → Respond
   const register = async (req: Request, res: Response) => {
     const validation = registerSchema.safeParse(req.body);
     if (!validation.success) return res.status(400).json({ error: ... });
     const user = await userService.createUser(validation.data);
     res.status(201).json(user);
   };
   ```

2. **Services** (`src/services/`)
   - Contain all business logic
   - Use Prisma for database operations
   - No HTTP concerns
   - Pure functions/exported async functions

3. **Routes** (`src/routes/`)
   - Define API endpoints
   - Import and wire controllers
   - Apply middleware (auth, upload)

4. **Middleware** (`src/middlewares/`)
   - `auth.middleware.ts`: Extracts and verifies JWT from cookies or Authorization header
   - `upload.middleware.ts`: Handles file uploads via Multer

### Frontend Architecture (Redux + Feature-Based)

1. **Redux Slices** (`src/features/*/[featureSlice].ts`)
   - `loginSlice.ts`: Auth state
   - `postSlice.ts`: Posts feed and management
   - `profileSlice.ts`: User profile data

2. **Components** (`src/features/*/`)
   - Page components in `src/features/page/`
   - Feature UI components in feature subdirectories
   - Reusable UI components in `src/components/`

3. **API Communication**
   - Centralized Axios instance in `src/libs/axios.ts`
   - Custom hooks in feature folders (e.g., `useLogin.ts`)

### Database Schema

**Models:**
- **User**: id, email (unique), name, password, avatarUrl, public_id, bio, timestamps
- **Post**: id, title, content, published, imageUrl, public_id, authorId, timestamps
- **Like**: id, userId, postId, timestamps (cascade delete)

---

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get profile (requires auth)
- `PUT /profile` - Update profile (requires auth)

### Post Routes (`/api/posts`)
- `GET /` - Get all posts
- `GET /my` - Get user's posts (requires auth)
- `POST /` - Create post (requires auth, supports file upload)
- `PUT /:id` - Update post (requires auth)
- `DELETE /:id` - Delete post (requires auth)
- `POST /:id/like` - Like post (requires auth)
- `DELETE /:id/like` - Unlike post (requires auth)

### Health Check
- `GET /health` - Server health check
- `GET /` - Welcome message

---

## Key Development Conventions

### Backend Conventions

1. **Validation**: Always use Zod schemas before processing data
   ```typescript
   const schema = z.object({ email: z.string().email(), ... });
   const result = schema.safeParse(req.body);
   ```

2. **Error Handling**: Return appropriate HTTP status codes
   - 400: Bad Request (validation errors)
   - 401: Unauthorized (missing/invalid token)
   - 404: Not Found
   - 500: Server Error

3. **JWT Tokens**: Stored in secure HTTP-only cookies OR Authorization header
   - Secret: `process.env.JWT_SECRET`
   - Verified in `authMiddleware`

4. **Type Safety**: Every controller should have typed parameters
   ```typescript
   export const register = async (req: Request, res: Response): Promise<void>
   ```

### Frontend Conventions

1. **Redux Usage**: Feature-based slices, use `useAppDispatch` and `useAppSelector` hooks
2. **Component Naming**: PascalCase for components (e.g., `PostCard.tsx`)
3. **Styling**: Use Tailwind CSS utility classes
4. **API Calls**: Use custom hooks to abstract axios calls
5. **TypeScript**: Strict typing for component props and Redux state

---

## Development Workflow

### Backend Development

```bash
# Start development server (watching file changes)
npm run dev

# Generate Prisma client after schema changes
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development

```bash
# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Docker Setup

```bash
# Start database and services
docker-compose up

# Stop services
docker-compose down

# Database credentials:
# User: my_user
# Password: my_secret_password
# Database: my_database
# Port: 5432
```

---

## Important Configuration Files

### Environment Variables (.env in backend root)
- `PORT` - Backend server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT signing
- `DATABASE_URL` - PostgreSQL connection string (Prisma)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend Port
- Development: `http://localhost:5173` (Vite)
- Backend: `http://localhost:3000`

---

## Common Tasks

### Add a New API Endpoint

1. Define Zod schema in `src/validations/[feature].validation.ts`
2. Add controller function in `src/controllers/[feature].controller.ts`
3. Create/update service functions in `src/services/[feature].service.ts`
4. Add route in `src/routes/[feature].routes.ts`
5. Import route in `src/app.ts`

### Modify Database Schema

1. Update `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update types if needed
4. Run `npm run prisma:generate`

### Add a New Frontend Page

1. Create component in `src/features/[feature]/`
2. Add route in `App.tsx`
3. Create Redux slice if needed in `src/features/[feature]/[featureSlice].ts`
4. Use `useAppDispatch` and `useAppSelector` for state

---

## Best Practices

✅ **Do:**
- Use TypeScript strict mode
- Validate all user inputs with Zod
- Hash passwords with bcryptjs
- Store sensitive tokens in HTTP-only cookies
- Use Redux for shared state
- Extract business logic to services
- Use proper HTTP status codes
- Add comments for complex logic

❌ **Don't:**
- Store passwords in plain text
- Trust user input without validation
- Mix concerns in controllers
- Fetch data directly in component render
- Use `any` type (use TypeScript generics)
- Hardcode configuration values

---

## Testing Notes

- Backend: No test suite configured (echo "Error: no test specified")
- Frontend: ESLint configured for code quality

---

## File Modification Guide

When making changes, follow these patterns:

### Backend Changes
- Controllers: Modify request/response handling, add validation
- Services: Update business logic, database queries
- Middleware: Modify request processing before reaching controllers
- Routes: Add new endpoints or modify route paths

### Frontend Changes
- Components: Update UI, add interactivity
- Slices: Modify Redux state structure
- Types: Update TypeScript interfaces for type safety

---

## Additional Resources

- Prisma Docs: https://www.prisma.io/docs/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Redux Toolkit Docs: https://redux-toolkit.js.org/
- Tailwind CSS Docs: https://tailwindcss.com/
- Zod Docs: https://zod.dev/

---

*Last Updated: 2026-03-29*
