# Silsila React Hero Integration & Setup Guide

This guide explains how to migrate this static website or configure a new React-based setup with **Tailwind CSS**, **TypeScript**, and **shadcn/ui** to use the newly created Hero component.

## Created Files in Codebase

We have added the following files to your workspace to support the hero component transition:
- [`/components/ui/background-paths.tsx`](file:///c:/Users/adity/Downloads/silsila/components/ui/background-paths.tsx) — Main Hero section component featuring stylized, animating mountain ridges and river flows.
- [`/components/ui/button.tsx`](file:///c:/Users/adity/Downloads/silsila/components/ui/button.tsx) — Copy-pasted shadcn-ui Button component.
- [`/components/ui/demo.tsx`](file:///c:/Users/adity/Downloads/silsila/components/ui/demo.tsx) — Demo page importing and configuring the hero component.
- [`/lib/utils.ts`](file:///c:/Users/adity/Downloads/silsila/lib/utils.ts) — Utility file containing the `cn` function for Tailwind CSS class merging.

---

## 1. Setup a React, TypeScript & Tailwind Project

If you are initializing a brand new React application from scratch using **Vite**, run the following commands:

```bash
# 1. Initialize a new Vite app with React and TypeScript
npm create vite@latest silsila-app -- --template react-ts
cd silsila-app

# 2. Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure Tailwind CSS
In your `tailwind.config.js` or `tailwind.config.ts`, configure the template paths:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

Add the Tailwind directives to your main CSS file (e.g., `src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. Initialize shadcn/ui

Run the shadcn CLI in your project root to configure paths, components, and basic styles:

```bash
npx shadcn@latest init
```

During initialization, the CLI will prompt you for configuration. Choose the following defaults:
- **Style**: Default
- **Base color**: Slate or Neutral
- **CSS variables**: Yes
- **Tailwind CSS config path**: `tailwind.config.js`
- **Global CSS file**: `src/index.css`
- **Import alias for components**: `@/components`
- **Import alias for utils**: `@/lib/utils`

### Why the `/components/ui` folder is important:
- **CLI Defaults**: The shadcn CLI automatically writes newly added UI components (like `button`, `dialog`, `input`) to `/components/ui` (or `@/components/ui`). Leaving this path unchanged prevents you from needing custom configurations or path overrides in `components.json`.
- **Modularity**: It keeps core primitive elements (e.g., shadcn's base inputs and buttons) segregated from your app's high-level sections (e.g., `components/Header.tsx`, `components/Footer.tsx`).

---

## 3. Install NPM Dependencies

To run the components we added, install the following dependencies in your new React project:

```bash
npm install framer-motion @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

---

## 4. Run the Dev Server

Once files are placed and dependencies are installed, start the local development server:
```bash
npm run dev
```
You can import the `DemoBackgroundPaths` from `components/ui/demo` to render the newly designed mountain & water stream hero page as your main landing view.
