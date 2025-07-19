# Themabinti 2.0 – Frontend

Modern React + TypeScript frontend for Themabinti 2.0, built with Vite, Tailwind CSS, shadcn/ui, and Radix UI. Provides a responsive, user-friendly interface for discovering, posting, and booking services.

---

## Features
- User authentication (buyers & sellers, JWT)
- Seller package selection (basic, standard, premium)
- Browse/search/filter services by category, subcategory, and location
- Post services (with media uploads, package limits enforced)
- Book appointments for services
- View blog posts
- Contact form
- Responsive/mobile-friendly UI

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
- App runs at: http://localhost:5173

---

## Scripts
- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint code

---

## Project Structure
- `src/` – Main source code
  - `components/` – UI and feature components
  - `pages/` – Route-based pages
  - `data/` – Static data (categories, mock data)
  - `hooks/` – Custom React hooks
  - `config/` – API config
  - `lib/` – Utilities

---

## Environment Variables
- Configure API base URL in `src/config/api.ts` if needed for local/backend integration.

---

## Tech Stack
- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui, Radix UI
- React Router, React Query, Zod, Axios

---

## License
[MIT](../LICENSE)
