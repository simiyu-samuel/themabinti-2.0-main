# Themabinti 2.0

A modern platform connecting Kenyan women with beauty, health, fashion, and lifestyle services. Built as a monorepo with a React + TypeScript frontend and a Node.js + Express + MongoDB backend.

---

## Project Structure

```
.
├── backend/    # Node.js/Express API, MongoDB, M-Pesa integration
├── frontend/   # React, TypeScript, Tailwind CSS, shadcn/ui
└── README.md   # (this file)
```

---

## Features

- **User Authentication:** Buyers and sellers, JWT-based auth, seller packages
- **Service Marketplace:** Post, browse, and search services by category/location
- **Appointments:** Book appointments for services or general inquiries
- **Blogs:** Read and post blog articles
- **Contact:** Contact form for inquiries
- **Payments:** M-Pesa integration for seller package upgrades

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or compatible package manager
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd themabinti-2.0-main
```

### 2. Setup Backend
```bash
cd backend
npm install
# Copy .env.example to .env and configure your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000 (default)

---

## Monorepo Details
- See `backend/README.md` for API, environment, and backend setup
- See `frontend/README.md` for UI, scripts, and frontend setup

---

## License
[MIT](LICENSE)
