# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (default: http://localhost:5173)
npm run build     # Type-check (vue-tsc) then production build
npm run preview   # Preview the production build locally
```

No test runner or linter is currently configured.

## Architecture

This is the **KDRC frontend** — a Vue 3 + TypeScript + Vite + Tailwind CSS v4 app that talks to a NestJS backend. The backend URL is set via `VITE_API_BASE_URL` (defaults to `http://localhost:3000`).

### Routing

Three route groups in `src/routes/`:

| File | Path | Purpose |
|------|------|---------|
| `index.ts` | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-otp`, `/auth/callback` | Auth pages, OAuth callback |
| `user.ts` | `/`, `/home`, `/explore`, `/community`, `/dashboard`, `/:id/write`, `/reading/:id`, etc. | Main user-facing routes |
| `admin.ts` | `/admin/**` | Admin panel routes |

Each route group maps to a layout:
- **UserLayout** (`src/layouts/UserLayout.vue`) — Navbar + Footer shell for public/user pages
- **DashboardLayout** (`src/layouts/DashboardLayout.vue`) — conditionally shows Navbar/Footer (hidden when on `/dashboard/**`). Used for dashboard, earnings, analytics, manuscripts, bookmarks
- **AdminLayout** (`src/layouts/AdminLayout.vue`) — Sidebar + Header shell for `/admin/**`

### State Management

**No Pinia is used** — despite being in `package.json`, it's commented out in `main.ts`. Instead, state is managed through two patterns:

1. **Module-level reactive refs** for shared state. The canonical example is auth: `src/services/auth.ts` exports `ref()` singletons (`token`, `user`) that are imported directly by components and the `useAuth` composable in `src/stores/useAuth.ts`.

2. **Composables** (`src/composables/`) own all feature/page state. Each composable returns reactive refs + methods and is instantiated per-component (e.g., `useWritingPage()`, `useBookWizard()`, `usePublishFlow()`). They are not singletons — each calling component gets its own state.

### API Layer

`src/services/api.ts` creates a shared Axios instance with two key behaviors:

1. **Response interceptor unwraps the NestJS envelope**: The backend wraps responses as `{ status: 'success', data: <payload> }`. The interceptor strips this so all callers receive `<payload>` directly (`response.data = response.data.data`).

2. **Auth token via `setApiAuthToken()`**: Sets/removes the `Authorization: Bearer <token>` header on the Axios defaults.

Domain-specific service modules (`src/services/bookApi.ts`, `chapterApi.ts`, `searchApi.ts`, etc.) import this shared `api` instance and export typed async functions. Each module corresponds to a backend resource.

### Auth Flow

- JWT token stored in `localStorage` under key `token`
- On app mount (`main.ts`), `restoreSession()` calls `GET /auth/me` to validate the token and populate the user object
- OAuth (Google, Facebook) redirects to the backend, which redirects back to `/auth/callback?access_token=...`
- The `useAuth` composable (`src/stores/useAuth.ts`) provides `login`, `signup`, `logout`, `completeOAuth` methods that coordinate API calls, session state, and router navigation

### Styling

**Tailwind CSS v4** via `@tailwindcss/vite` plugin. Do **not** use v3 patterns (`npx tailwindcss init`, `@tailwind base/components/utilities`).

Custom design tokens live in `src/assets/style/style.css` as CSS custom properties:

- `--text`, `--text-h` — body and heading text colors
- `--bg` — page background
- `--border` — border color
- `--accent`, `--accent-bg`, `--accent-border` — brand green
- `--sans`, `--heading`, `--mono` — font stacks (Manrope, Fraunces, system mono)

The `useTheme` composable toggles a `.dark` class on `<html>`, which triggers dark-mode overrides on these custom properties. Tailwind's `dark:` variant is **not** used — theming is driven entirely through the CSS variables.

### Key Patterns

- **Path alias**: `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- **Components must be explicitly imported** — `unplugin-vue-components` is in `package.json` but not wired in `vite.config.ts`
- **Toast notifications**: `vue-toastification` (`useToast()`) for success/error feedback throughout composables
- **Form validation**: `vee-validate` + `yup` for form schemas
- **Writing editor**: TipTap (ProseMirror-based) — see `src/composables/useWritingPage.ts` for the autosave pattern (5-second debounce on content changes, Ctrl+S for manual save)
- **File uploads**: Cloudinary via the backend (`POST /upload/{type}`). `src/composables/useCloudinaryUpload.ts` provides a reusable composable for book covers, content images, and avatars.
- **Real-time chat**: Socket.io client — used by `src/components/chat/ChatBox.vue`
