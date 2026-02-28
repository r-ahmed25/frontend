# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite on port 5173)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Preview prod build:** `npm run preview`

No test framework is configured.

## Environment

Set `VITE_API_URL` to the backend URL (defaults to `http://localhost:5000`). The Vite dev server proxies API routes (`/auth`, `/products`, `/cart`, `/orders`, `/admin`, `/govt`, `/services`, `/public`) to the backend, with HTML-accept bypass so SPA routing works.

## Architecture

React 19 SPA using Vite + SWC, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), React Router v7, Zustand for state, Framer Motion for animations.

### State Management (Zustand stores in `src/store/`)
- **authStore** — session (user, accessToken, refreshToken) persisted to localStorage. Token refresh and logout handled here.
- **cartStore** — cart state with GST tax calculations (18% inclusive, split CGST/SGST). Syncs with backend API.
- **themeStore** — dark/light/system theme, applied via `ThemeProvider` component.

### API Layer (`src/api/`)
- **client.js** — central `apiRequest()` fetch wrapper. Attaches Bearer token from authStore (falls back to localStorage). Auto-logs out on 401.
- Domain modules (`products.js`, `orders.js`, `auth.js`, etc.) call `apiRequest()`.

### Routing (`src/routes/AppRoutes.jsx`)
Three route tiers:
1. **Public** — `/login`, `/register`, `/products-guest`, `/services`
2. **Protected** (authenticated) — wrapped in `<ProtectedRoute>`. Retail flows: products, cart, checkout, orders, wishlist.
3. **Admin** — wrapped in `<ProtectedRoute>` + `<AdminRoute>`. Dashboard, product/order/enquiry/quote management.
4. **Govt/Verified** — wrapped in `<PostLoginVerificationRoute>`. Enquiries, quotes, service quotes.

### Key Patterns
- Navbar and footer are hidden on `/login`, `/register`, and invoice pages (controlled in `App.jsx`).
- Unauthenticated users are redirected to `/login` for non-public routes.
- Guest product browsing uses separate components (`ProductListGuest`, `ProductDetailsGuest`) at `/products-guest`.
- Icons from both `lucide-react` and `react-icons`. Toast notifications via `react-hot-toast`.
- Cloudinary is used for image hosting.
