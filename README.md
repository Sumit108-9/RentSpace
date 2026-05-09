# 🛋️ RentSpace - Furniture Rental E-commerce Platform

A full-stack **MERN application** for renting premium furniture and appliances. Built with modern web technologies, RentSpace offers a seamless furniture rental experience similar to Furlenco, Rentomojo, and Pepperfry.

[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-MERN-green)](https://mern.io)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🎯 Project Overview

RentSpace solves the problem of expensive furniture purchases by offering a flexible rental model. Users can rent furniture for as long as they need, upgrade anytime, and avoid the hassle of reselling when moving.

### Key Value Propositions
- 💰 **Affordable** - Pay monthly instead of large upfront costs
- 🔄 **Flexible** - Rent, upgrade, or return anytime
- 🚚 **Convenient** - Free delivery and pickup
- 🏠 **Quality** - Premium furniture with maintenance included

---

## 🚀 Features

### 👤 User Features

| Feature | Description |
|---------|-------------|
| 🔍 **Browse & Search** | Filter furniture by category, price, and style |
| 🛒 **Smart Cart** | Add items with custom rental duration |
| 💳 **Secure Payments** | Razorpay integration with multiple payment options |
| 📦 **Order Tracking** | Real-time order status updates |
| ❤️ **Wishlist** | Save items for later |
| 📍 **Location Selector** | Choose delivery city and pincode |
| 👤 **User Dashboard** | Manage orders, profile, and preferences |

### 🛠️ Admin Features

| Feature | Description |
|---------|-------------|
| 📊 **Analytics Dashboard** | View sales, orders, and user statistics |
| 🛍️ **Product Management** | Add, edit, delete products with image upload |
| 📋 **Order Management** | View and update order statuses |
| 👥 **User Management** | View registered users and their activity |

### ⚙️ Technical Features

- 🔐 **JWT Authentication** - Secure login with token-based auth
- 📧 **Email Notifications** - Order confirmations and password resets
- 🖼️ **Image Handling** - Cloudinary for product images
- 📱 **Responsive Design** - Mobile-first approach
- 🧪 **Form Validation** - Input validation on frontend and backend
- 🐛 **Error Handling** - Centralized error management

---

## 🧑‍💻 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks |
| **Vite** | Fast build tool and dev server |
| **React Router v6** | Client-side routing |
| **Zustand** | Lightweight state management |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **CSS-in-JS** | Component styling |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email service |
| **Razorpay** | Payment gateway |

---

## 📁 Project Structure

```bash
RentSpace/
├── 📂 backend/                    # Node.js + Express API
│   ├── 📂 config/
│   │   └── database.js           # MongoDB connection
│   ├── 📂 controllers/           # Route handlers
│   │   ├── auth.controller.js  # Login, register, forgot password
│   │   ├── product.controller.js # Product CRUD
│   │   └── order.controller.js   # Order management
│   ├── 📂 middleware/           # Custom middleware
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── 📂 models/                # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── passwordReset.model.js
│   ├── 📂 routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   ├── 📂 services/              # External services
│   │   └── email.service.js      # Nodemailer config
│   ├── 📂 utils/                 # Helper functions
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
├── 📂 frontend/                   # React + Vite SPA
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 layout/         # Layout, Navbar, Footer
│   │   │   │   ├── Layout.jsx    # Main layout wrapper
│   │   │   │   └── ...
│   │   │   ├── 📂 common/         # Reusable components
│   │   │   └── ...
│   │   ├── 📂 pages/              # Route pages
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Products.jsx       # Product listing
│   │   │   ├── ProductDetails.jsx # Single product
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── Register.jsx       # User registration
│   │   │   ├── Cart.jsx           # Shopping cart
│   │   │   ├── Checkout.jsx       # Payment checkout
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── Orders.jsx         # Order history
│   │   │   ├── About.jsx          # About us page
│   │   │   └── ...
│   │   ├── 📂 store/
│   │   │   └── useStore.js        # Zustand store
│   │   ├── 📂 utils/
│   │   │   └── api.js             # Axios instance
│   │   ├── App.jsx                # Main router
│   │   └── main.jsx               # Entry point
│   ├── 📂 public/                 # Static assets
│   ├── index.html
│   └── package.json
│
├── 📄 README.md                   # Project documentation
├── 📄 VIVA_PREPARATION.md         # College viva guide
└── 📄 LICENSE
```

---

## ⚙️ Setup Instructions

### 📌 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn
- Gmail account (for email notifications)
- Razorpay account (for payments)

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentspace
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
```

Run server:

```bash
npm run dev        # Development with nodemon
npm start          # Production
```

Optional - Seed database:

```bash
node import-products.js
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

Run:

```bash
npm run dev        # Development server
npm run build      # Production build
```

---

## ▶️ Running the App

1. **Start MongoDB** - Ensure MongoDB is running locally or use Atlas
2. **Start Backend** - `cd backend && npm run dev`
3. **Start Frontend** - `cd frontend && npm run dev`
4. **Open** - http://localhost:5173

---

## 🔐 Admin Access

### Option 1: Create Admin User via Script

```bash
cd backend
node create-test-user.js
```

### Option 2: Manual Database Update

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Payment (Razorpay)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create payment order |
| POST | `/api/payment/verify` | Verify payment signature |

---

## 📚 VIVA Preparation

See **[VIVA_PREPARATION.md](./VIVA_PREPARATION.md)** for:
- Frontend interview questions (React, Hooks, State Management)
- Backend interview questions (Node.js, Express, MongoDB)
- Full stack integration concepts
- Common viva Q&A with answers

---

## 📸 Screenshots

*Add your project screenshots here*

| Home Page | Products | Cart |
|-----------|----------|------|
| ![Home](screenshots/home.png) | ![Products](screenshots/products.png) | ![Cart](screenshots/cart.png) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## � License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Razorpay](https://razorpay.com/) for payment integration
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://react.dev/) for frontend framework
- [Express](https://expressjs.com/) for backend framework

---

⭐ **If you found this project helpful, please give it a star!**

**Made with ❤️ for College Project**
