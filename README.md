# B2B Request-Based E-Commerce Marketplace

A full-stack **MERN** e-commerce marketplace inspired by [Myntra](https://www.myntra.com/), featuring **JWT-based Role-Based Access Control (RBAC)**, a **Seller Dashboard** with product CRUD, and a **Buy Request** workflow for customers — instead of direct checkout, customers add items to a cart and send buy requests to the seller for approval.

## Features

### 🔐 Authentication & RBAC
- JWT-based authentication (login / register)
- Two roles: **Seller** (admin) and **Customer**
- Single seller account (seeded via API endpoint)
- Protected routes and role-guarded API endpoints

### 🏪 Seller (Admin) Capabilities
- Full **CRUD** on products (Create, Read, Update, Delete)
- **File upload** for product images (via Multer)
- **Buy Requests Inbox** — view all customer requests with Approve / Reject actions
- Category-based product organization

### 🛒 Customer Capabilities
- Browse products by **category** (Men, Women, Kids, Home & Living, Beauty, Studio)
- **Add to Cart** with quantity controls
- Review cart with **price breakdown** → **Send Buy Request** to seller in one click
- **My Requests** page — track request status (Pending / Approved / Rejected)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Redux Toolkit, React Router, Vite, Axios |
| **Backend** | Node.js, Express, Mongoose, JWT, Multer |
| **Database** | MongoDB |
| **Styling** | CSS, Bootstrap 5 |

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/gauravjain8056/Ecommerce-site---inspired-by-Myntra.git
cd Ecommerce-site---inspired-by-Myntra
```

### 2. Setup the Backend

```bash
cd Backend/node-backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=seller@store.com
ADMIN_PASSWORD=Seller@1234
ADMIN_NAME=Store Admin
```

Start the server:

```bash
npm start
```

### 3. Seed the Seller Account (one time)

```bash
curl -X POST http://localhost:8080/api/auth/seed-admin
```

This creates the admin/seller account with the credentials in your `.env`.

### 4. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register as customer |
| POST | `/api/auth/login` | Public | Login → returns JWT |
| POST | `/api/auth/seed-admin` | Public | Create seller (once) |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List all (supports `?category=`) |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | 🔐 Seller | Create (multipart with image) |
| PUT | `/api/products/:id` | 🔐 Seller | Update product |
| DELETE | `/api/products/:id` | 🔐 Seller | Delete product |

### Buy Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/buy-requests` | 🔐 Customer | Submit buy request |
| GET | `/api/buy-requests/my` | 🔐 Customer | View own requests |
| GET | `/api/buy-requests` | 🔐 Seller | View all requests |
| PATCH | `/api/buy-requests/:id` | 🔐 Seller | Update status |

## Project Structure

```
├── Backend/node-backend/
│   ├── controllers/        # Auth, Product, BuyRequest logic
│   ├── middleware/          # JWT verification & role guards
│   ├── models/             # Mongoose schemas (User, Product, BuyRequest)
│   ├── routes/             # Express route definitions
│   ├── uploads/            # Uploaded product images
│   ├── app.js              # Entry point — MongoDB + Express setup
│   └── .env                # Environment variables
│
├── frontend/src/
│   ├── components/         # Header, Footer, HomeItem, AuthModal, etc.
│   ├── routes/             # App, Home, Bag, SellerDashboard, MyRequests
│   ├── store/              # Redux slices (auth, bag, items, fetch)
│   └── main.jsx            # Router + Redux Provider
```

## User Flow

```
Customer: Browse → Add to Cart → Review Cart → Send Buy Request → Track in "My Requests"
Seller:   Login → Dashboard → Add Products → Review Buy Requests → Approve / Reject
```

## License

ISC
