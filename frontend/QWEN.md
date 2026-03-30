# Frontend — Small Social Media

## Project Overview

This is the frontend application for a small social media platform. It is a **React + TypeScript + Vite** single-page application (SPA) with the following characteristics:

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with custom interceptors
- **UI Philosophy**: Clean, minimal, functional design with gray-based palette

### Architecture

```
src/
├── app/              # App-level configuration (store, hooks)
├── components/       # Shared UI components (SideBar, icons)
├── features/         # Feature-based modules
│   ├── auth/         # Authentication (Login, Register)
│   ├── page/         # Static pages (Home, About)
│   ├── posts/        # Posts feature (feed, my posts, likes)
│   └── profile/      # User profile management
├── libs/             # Utility libraries (axios instance)
└── types/            # Shared TypeScript types
```

### Key Features

- User authentication (register, login, logout)
- Posts feed with pagination
- Personal posts management ("My Posts")
- Like/unlike functionality
- User profile page
- Responsive sidebar navigation

---

## Building and Running

### Prerequisites

- Node.js (version compatible with the project's `package.json`)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite development server with hot module replacement (HMR).

### Production Build

```bash
npm run build
```

Compiles TypeScript and bundles the application for production. Output is placed in `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

| Variable       | Description                    | Default            |
|----------------|--------------------------------|--------------------|
| `VITE_API_URL` | Backend API base URL           | `http://localhost:3000` |

---

## State Management (Redux Toolkit)

### Store Structure

```typescript
{
  profile: ProfileState,
  login: LoginState,
  posts: PostsState
}
```

### Typed Hooks

Use the pre-typed hooks from `src/app/hooks.ts`:

```typescript
import { useAppDispatch, useAppSelector } from '../app/hooks';

const dispatch = useAppDispatch();
const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
```

### Async Thunks

The app uses Redux Toolkit's `createAsyncThunk` for API calls:

- `fetchPosts` — Fetch posts with pagination
- `fetchOwnPosts` — Fetch user's own posts
- `likePost` — Like a post
- `unlikePost` — Unlike a post

---

## API Integration

### Axios Instance

Located at `src/libs/axios.ts`:

- Base URL from `VITE_API_URL`
- `withCredentials: true` for cookie-based auth
- Response interceptor handles 401 (unauthorized) by logging out and redirecting to `/login`

### Error Handling Convention

Backend returns errors as `{ error: "..." }`:

```typescript
try {
  await api.post("/api/...", payload);
  navigate("/target_route");
} catch (err: any) {
  const data = err?.response?.data;
  setError(data?.error ?? data?.message ?? "Something went wrong.");
}
```

---

## UI Style Guide

### Design Philosophy

**Clean, minimal, and functional.** Restrained gray-based palette, thin borders, subtle shadows, soft hover states.

### Color Palette

| Role               | Tailwind Classes                    |
|--------------------|-------------------------------------|
| Page background    | `bg-gray-50`                        |
| Card background    | `bg-white`                          |
| Primary text       | `text-gray-900`                     |
| Secondary text     | `text-gray-600`, `text-gray-500`    |
| Muted text         | `text-gray-400`                     |
| Border (strong)    | `border-gray-200`                   |
| Border (subtle)    | `border-gray-100`                   |
| Hover background   | `hover:bg-gray-100`                 |
| Primary button     | `bg-gray-900` → `hover:bg-gray-700` |
| Danger             | `text-red-500`, `hover:bg-red-50`   |

### Component Patterns

#### Card
```jsx
<div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
  {/* content */}
</div>
```

#### Primary Button
```jsx
<button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                   bg-gray-900 text-white hover:bg-gray-700
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
  Save
</button>
```

#### Form Input
```jsx
<input
  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900
             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300
             focus:border-transparent transition"
/>
```

#### Page Template
```jsx
<div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
  <div className="max-w-2xl mx-auto">
    <div className="mb-8">
      <h1 className="text-xl font-semibold text-gray-900">Title</h1>
      <p className="text-sm text-gray-500 mt-1">Description</p>
    </div>
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      {/* content */}
    </div>
  </div>
</div>
```

### Icons

All icons are **inline SVG** (Heroicons outline style). Never use icon library imports.

```jsx
const SomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
       stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="..." />
  </svg>
);
```

### Transitions

- `transition-colors duration-150` — color/background changes
- `transition-transform duration-200 ease-in-out` — toggle animations

---

## Development Conventions

### TypeScript

- Strict mode enabled via `tsconfig.json`
- Two project references: `tsconfig.app.json` (source) and `tsconfig.node.json` (build config)

### ESLint

Configuration in `eslint.config.js`:
- Uses `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Ignores `dist/` directory
- Browser globals enabled

### File Naming

- Components: PascalCase (e.g., `SideBar.tsx`, `Login.tsx`)
- Slices: camelCase with `.slice.ts` suffix (e.g., `postSlice.ts`)
- Types: lowercase directories with descriptive names (e.g., `types/post.ts`)
- Hooks: `hooks.ts` or custom hook files

### Feature-Based Organization

Each feature in `src/features/` is self-contained:
```
features/
├── auth/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── loginSlice.ts
│   ├── types/
│   └── hooks/
```

---

## Routing

Routes are defined in `App.tsx`:

| Path        | Component     | Auth Required |
|-------------|---------------|---------------|
| `/`         | Home          | No            |
| `/about`    | About         | No            |
| `/register` | Register      | No            |
| `/login`    | Login         | No            |
| `/posts`    | PostPage      | Yes           |
| `/my_posts` | MyPostPage    | Yes           |
| `/profile`  | Profile       | Yes           |

---

## Key Dependencies

| Package              | Version | Purpose                    |
|----------------------|---------|----------------------------|
| `react`              | ^19.2.4 | UI framework               |
| `react-router-dom`   | ^7.13.2 | Client-side routing        |
| `@reduxjs/toolkit`   | ^2.11.2 | State management           |
| `react-redux`        | ^9.2.0  | Redux React bindings       |
| `axios`              | ^1.13.6 | HTTP client                |
| `tailwindcss`        | ^4.2.2  | Utility-first CSS          |
| `zustand`            | ^5.0.12 | Alternative state (unused) |

---

## Prompts Directory

The `prompts/` directory contains development guidelines:

- `api_call_style.prompt.md` — Axios configuration and API call patterns
- `ui_style_skill.prompt.md` — Comprehensive UI style guide and design system

---

## Public Assets

Located in `public/`:
- `favicon.svg` — Site favicon
- `icons.svg` — SVG sprite sheet (if used)

---

## Git

The project uses `.gitignore` to exclude:
- `node_modules/`
- `dist/`
- `.env` files
- IDE/editor configurations
