# Project Structure Guidelines

## 1. Folder Structure (Next.js App Router)

```
/src
  /app                  # App Router Pages
    /(auth)             # Authentication Routes (Login/Register)
    /(dashboard)        # Admin Dashboard Routes
      /admin
        /tables
        /bookings
    /api                # API Routes (Edge Functions/Webhooks)
    /globals.css        # Tailwind Imports
    /layout.tsx         # Root Layout
    /page.tsx           # Landing Page

  /components
    /ui                 # Shadcn Base Components (Button, Input, etc.)
    /layout             # Header, Footer, Sidebar
    /features           # Feature-Specific Components
      /tables           # TableCard, TableMap, TableFilter
      /bookings         # BookingForm, PaymentUpload
      /auth             # LoginForm, RegisterForm

  /lib
    /supabase           # Supabase Client & Server Utilities
    /utils.ts           # Helper Functions (cn, formatCurrency)
    /constants.ts       # Global Constants (Prices, Configs)
    /validators         # Zod Schemas (bookingSchema, loginSchema)

  /hooks                # Custom React Hooks
    /use-tables.ts
    /use-auth.ts

  /types                # TypeScript Interfaces & Types
    /database.ts        # Supabase Generated Types
    /index.ts           # App specific types
```

## 2. Coding Standards
- **Naming:** `kebab-case` untuk file/folder component, `PascalCase` untuk nama komponen React.
- **Imports:** Gunakan absolute imports `@/components/...`
- **Function Components:** Gunakan `export function ComponentName() {}`.
- **State:** Gunakan `useState` untuk lokal, `Zustand` untuk global state (jika kompleks).

## 3. Git Workflow
- **Main Branch:** `main` (Production Ready)
- **Dev Branch:** `dev` (Active Development)
- **Feature Branch:** `feat/nama-fitur` (e.g., `feat/booking-engine`)
