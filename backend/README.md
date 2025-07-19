# Themabinti 2.0 – Backend

Node.js/Express backend for Themabinti 2.0, providing RESTful APIs for authentication, services, appointments, blogs, contact, and M-Pesa payments.

---

## Features
- User registration/login (buyers & sellers, JWT auth)
- Seller packages (basic, standard, premium) with media upload limits
- Post, browse, and search services by category/subcategory/location
- Book appointments for services or general inquiries
- Blog CRUD
- Contact form submissions
- M-Pesa payment integration for seller packages

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in `backend/` with the following (example):
```
MONGODB_URI=mongodb://localhost:27017/themabinti
JWT_SECRET=your_jwt_secret
PORT=5000
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

### 3. Start the server
```bash
npm run dev
```

---

## API Overview

| Endpoint                        | Method | Description                       |
|---------------------------------|--------|-----------------------------------|
| `/api/register`                 | POST   | Register user (buyer/seller)      |
| `/api/login`                    | POST   | Login user                        |
| `/api/services`                 | GET    | List all services                 |
| `/api/services`                 | POST   | Post a new service (seller only)  |
| `/api/services/:category`       | GET    | List latest services by category  |
| `/api/service/:id`              | GET    | Get service by ID                 |
| `/api/appointments`             | POST   | Book an appointment               |
| `/api/blogs`                    | GET    | List all blogs                    |
| `/api/blogs`                    | POST   | Post a new blog                   |
| `/api/contact`                  | POST   | Submit contact form               |
| `/api/mpesa/initiate`           | POST   | Initiate M-Pesa payment           |

---

## Scripts
- `npm start` – Start server
- `npm run dev` – Start with nodemon (dev)

---

## Dependencies
- express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken, axios
- nodemon (dev)

---

## License
[MIT](../LICENSE) 