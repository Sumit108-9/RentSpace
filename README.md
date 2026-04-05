# RentSpace - Furniture Rental E-commerce Platform

A full-stack MERN application for renting premium furniture and appliances, similar to Furlenco.

## Features

- **User Features**
  - Browse furniture by categories (Sofas, Beds, Tables, Appliances, etc.)
  - Advanced filtering and search
  - Shopping cart with rental duration selection
  - Secure checkout with multiple payment options
  - User dashboard to manage orders and profile
  - Wishlist functionality

- **Admin Features**
  - Dashboard with statistics
  - Manage products (CRUD operations)
  - Manage orders and update status
  - User management

- **Technical Features**
  - JWT authentication
  - Responsive design
  - REST API with MongoDB
  - Image optimization
  - Error handling

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

## Project Structure

```
Project/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Authentication & error middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── seed/           # Sample data
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Zustand store
│   │   └── utils/      # API utilities
│   └── index.html
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furniture-rental
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

6. (Optional) Seed sample data:
```bash
npm run seed
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Running the Application

1. Start MongoDB service
2. Start backend server (`npm run dev` in backend folder)
3. Start frontend dev server (`npm run dev` in frontend folder)
4. Open `http://localhost:5173` in your browser

## Default Admin Account

After seeding the database, you can create an admin user by manually updating a user's role to 'admin' in MongoDB, or register a new user and modify the role in the database.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/stats` - Get order stats (Admin)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

## Screenshots

- Landing Page with hero section, categories, featured products
- Product Listing with filters
- Product Details with rental duration selection
- Shopping Cart with price breakdown
- Checkout with address and payment
- User Dashboard with orders and profile
- Admin Panel for management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
