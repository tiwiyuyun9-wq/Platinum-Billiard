# Design System Documentation

## 1. Brand Identity
**Brand Name:** Platinum Billiard
**Theme:** Ultra-Premium, "Platinum" Aesthetic (Metallic, Sleek, Dark).
**Primary Color:** Platinum Silver (Metal Gradients).

### Color Palette (Tailwind)
- **Background:** `zinc-950` (Deep, rich black)
- **Primary:** `zinc-100` (Platinum White/Silver)
- **Secondary:** `zinc-900` (Surface)
- **Accent:** `indigo-500` (Subtle deep blue for premium focus)
- **Text:** `zinc-50` (Primary), `zinc-400` (Secondary)

## 2. Typography
**Font Family:** `Inter` (Body).
**Headings:**
- H1: `text-4xl font-bold tracking-tight` (Page Titles)
- H2: `text-2xl font-semibold tracking-tight` (Section Headers)
- H3: `text-xl font-medium` (Card Titles)

## 3. UI Components (Shadcn UI)
Kita akan menggunakan komponen Shadcn sebagai base, dengan kustomisasi sesuai tema Emerald.

### Buttons
- **Primary:** `bg-emerald-600 hover:bg-emerald-700 text-white`
- **Secondary:** `bg-slate-800 hover:bg-slate-700 text-white`
- **Ghost:** `hover:bg-slate-800 text-slate-300`

### Status Badges (Penting untuk Table Status)
- `Available`: `bg-emerald-500/20 text-emerald-500 border-emerald-500/50`
- `Occupied`: `bg-red-500/20 text-red-500 border-red-500/50`
- `Booked`: `bg-amber-500/20 text-amber-500 border-amber-500/50`

## 4. Spacing & Layout
**Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
**Border Radius:** `rounded-lg` (Standard), `rounded-xl` (Cards)
**Grid System:** Responsive Grid 1-2-3-4 kolom untuk daftar meja.

## 5. Animations (Framer Motion)
- **Table Hover:** `scale-105 transition-all duration-300`
- **Page Transition:** `opacity-0` -> `opacity-100` (smooth fade-in)
