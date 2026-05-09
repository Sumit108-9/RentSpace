# 📚 RentSpace - VIVA Preparation Guide

**Project:** RentSpace - Furniture Rental E-commerce Platform  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)  
**Prepared for:** College Project Viva

---

# 🎯 PART 1: FRONTEND (React + Vite)

## 1.1 Core Concepts

### What is React?
- **Answer:** React is a JavaScript library for building user interfaces
- **Key Feature:** Component-based architecture with Virtual DOM for efficient rendering
- **Why we used it:** Fast, reusable components, large ecosystem

### What is Vite?
- **Answer:** Modern build tool (replaces Create React App)
- **Advantages:** Faster dev server, instant hot module replacement, optimized production builds
- **Config:** `vite.config.js`

### React Hooks We Used
```javascript
// useState - for component state
const [count, setCount] = useState(0);

// useEffect - for side effects (API calls, subscriptions)
useEffect(() => { fetchData(); }, []);

// useContext - for global state (Toast notifications)
const toast = useContext(ToastContext);

// useNavigate - for routing
const navigate = useNavigate();
```

## 1.2 Project Structure

```
frontend/src/
├── components/
│   ├── layout/           # Layout, Navbar, Footer
│   ├── common/           # Reusable components
│   └── ...
├── pages/               # Route pages
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Login.jsx
│   └── ...
├── store/              # Zustand state management
│   └── useStore.js
├── utils/              # Helper functions
│   └── api.js          # Axios instance
└── App.jsx             # Main router
```

## 1.3 State Management (Zustand)

### Why Zustand?
- Lightweight, simple, no boilerplate
- Replaces Redux for smaller projects

### Our Store Structure:
```javascript
const useStore = create((set, get) => ({
  // State
  user: null,
  cart: [],
  products: [],
  
  // Actions
  login: (userData) => set({ user: userData }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  fetchProducts: async () => { /* API call */ }
}));
```

## 1.4 Routing (React Router v6)

```javascript
// Routes setup in App.jsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="products" element={<Products />} />
  <Route path="login" element={<Login />} />
</Route>

// Navigation
const navigate = useNavigate();
navigate('/login');

// URL parameters
<Route path="products/:id" element={<ProductDetails />} />
const { id } = useParams();
```

## 1.5 API Integration (Axios)

```javascript
// utils/api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## 1.6 Key Frontend Features

| Feature | Implementation |
|---------|---------------|
| **Authentication** | JWT tokens in localStorage, Protected Routes |
| **Cart** | Zustand store with localStorage persistence |
| **Location Selector** | Modal with city/pincode selection |
| **Image Gallery** | Custom carousel component |
| **Toast Notifications** | Context API for global notifications |
| **Responsive Design** | CSS Grid, Flexbox, Media queries |

## 1.7 Common VIVA Questions - Frontend

**Q: How does authentication work?**
> A: User logs in → Backend returns JWT → Stored in localStorage → Attached to API requests via Axios interceptor → Protected routes check token.

**Q: How is state managed across components?**
> A: We use Zustand for global state (user, cart, products) and useState for local component state.

**Q: Why did you choose Zustand over Redux?**
> A: Zustand is simpler, less boilerplate, perfect for our project size. No need for actions/reducers.

**Q: How do you handle form validation?**
> A: Controlled inputs with useState, validation before API calls, error messages displayed inline.

---

# 🔧 PART 2: BACKEND (Node.js + Express + MongoDB)

## 2.1 Core Concepts

### What is Node.js?
- **Answer:** JavaScript runtime built on Chrome's V8 engine
- **Why:** Non-blocking I/O, fast, same language as frontend

### What is Express.js?
- **Answer:** Web framework for Node.js
- **Features:** Routing, middleware, request/response handling

### What is MongoDB?
- **Answer:** NoSQL document database
- **Why:** Flexible schema, JSON-like documents, scalable
- **ODM:** Mongoose for schema modeling

## 2.2 Project Structure

```
backend/
├── config/
│   └── database.js        # DB connection
├── controllers/           # Business logic
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── order.controller.js
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── validation.middleware.js
│   └── error.middleware.js
├── models/                # Mongoose schemas
│   ├── user.model.js
│   ├── product.model.js
│   └── order.model.js
├── routes/                # API routes
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── order.routes.js
├── services/
│   └── email.service.js   # Nodemailer
├── utils/
└── server.js             # Entry point
```

## 2.3 Key Models (Mongoose Schemas)

### User Model
```javascript
{
  name: String,
  email: { type: String, unique: true },
  password: { type: String, bcrypt hashed },
  role: { type: String, enum: ['user', 'admin'] },
  phone: String,
  isEmailVerified: Boolean
}
```

### Product Model
```javascript
{
  name: String,
  category: String,
  monthlyRent: Number,
  images: [String],
  stock: Number,
  isActive: Boolean
}
```

### Order Model
```javascript
{
  user: { type: ObjectId, ref: 'User' },
  orderItems: [{
    product: { type: ObjectId, ref: 'Product' },
    quantity: Number,
    monthlyRent: Number
  }],
  totalPrice: Number,
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'] },
  shippingAddress: Object,
  paymentMethod: String
}
```

## 2.4 Authentication Flow (JWT)

```javascript
// Login Controller
1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
4. Return token + user data

// Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};
```

## 2.5 API Routes Structure

```javascript
// Routes -> Controller -> Model flow

// auth.routes.js
POST   /api/auth/register    → register controller
POST   /api/auth/login       → login controller
GET    /api/auth/me          → getProfile controller

// product.routes.js
GET    /api/products         → getAllProducts
GET    /api/products/:id      → getProductById
POST   /api/products          → createProduct (admin)
PUT    /api/products/:id      → updateProduct (admin)
DELETE /api/products/:id      → deleteProduct (admin)

// order.routes.js
POST   /api/orders            → createOrder
GET    /api/orders            → getMyOrders
GET    /api/orders/:id        → getOrderById
PUT    /api/orders/:id/status → updateOrderStatus (admin)
```

## 2.6 Payment Integration (Razorpay)

```javascript
// Flow:
1. User clicks "Pay Now"
2. Frontend calls POST /api/payment/create-order
3. Backend creates Razorpay order (amount, currency)
4. Returns order_id to frontend
5. Razorpay checkout popup opens
6. On success: verify payment signature
7. Create order in database
```

## 2.7 Email Service (Nodemailer)

```javascript
// Services
- sendOrderConfirmationEmail()  → After order placed
- sendPasswordChangedEmail()    → After password reset
- sendVerificationEmail()      → After registration

// Config: Gmail SMTP with app password
```

## 2.8 Database Operations

```javascript
// Common Mongoose operations

// Find all
const products = await Product.find({ isActive: true });

// Find with filter
const orders = await Order.find({ user: userId });

// Find one
const user = await User.findOne({ email });

// Create
const order = await Order.create(orderData);

// Update
await Product.findByIdAndUpdate(id, updateData);

// Delete
await Product.findByIdAndDelete(id);

// Populate (join)
const order = await Order.findById(id).populate('user', 'name email');
```

## 2.9 Middleware Chain

```javascript
// Example: Creating an order
POST /api/orders
  ↓
auth.middleware (verify JWT)
  ↓
validation.middleware (validate request body)
  ↓
order.controller (business logic)
  ↓
order.model (save to DB)
  ↓
Response
```

## 2.10 Common VIVA Questions - Backend

**Q: How does JWT authentication work?**
> A: User logs in → Server creates JWT with user ID + secret → Token sent to client → Client sends token in header for protected routes → Server verifies signature → Grants access.

**Q: What is the difference between SQL and MongoDB?**
> A: SQL is relational with fixed schema, tables, and joins. MongoDB is document-based with flexible schema, collections, and embedded documents. We chose MongoDB for flexibility.

**Q: How do you handle errors?**
> A: Centralized error middleware catches all errors → Returns consistent error response → Logs to console for debugging.

**Q: Explain the MVC pattern in your project.**
> A: Models (data structure), Views (frontend React components), Controllers (business logic). Routes direct requests to controllers.

**Q: How is payment integration secure?**
> A: Razorpay handles card details (PCI compliant) → We verify payment signature with our secret → Never store card info.

---

# 🔌 PART 3: FULL STACK INTEGRATION

## 3.1 Request/Response Flow

```
User Action
    ↓
Frontend (React)
    ↓  API Call (Axios)
Backend (Express)
    ↓
Middleware (Auth/Validation)
    ↓
Controller (Business Logic)
    ↓
Model (Database Query)
    ↓
MongoDB
    ↓
Response (JSON)
    ↓
Frontend Updates UI
```

## 3.2 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=rzp_test_xxx
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentspace
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

## 3.3 Deployment Considerations

| Environment | Frontend | Backend |
|-------------|----------|---------|
| **Development** | Vite dev server (5173) | Nodemon (5000) |
| **Production** | Build → Static files | Node.js + PM2 |
| **Database** | Local MongoDB | MongoDB Atlas |
| **Hosting** | Vercel/Netlify | Render/Railway |

---

# 🎯 PART 4: PROJECT-SPECIFIC QUESTIONS

## 4.1 Feature Explanations

**Q: How does the cart work?**
> A: User adds item → Stored in Zustand store → Persisted to localStorage → On checkout, cart items sent to backend → Order created → Cart cleared.

**Q: Explain the location/pincode feature.**
> A: User selects city or enters pincode → Saved in localStorage → Used during checkout for delivery address → Products filtered by availability in that location.

**Q: How does the rental system work?**
> A: Products have monthly rent price → User selects duration (months) → Total calculated as (monthlyRent × months × quantity) → Payment made → Rental period tracked.

**Q: What is the admin dashboard?**
> A: Protected route for users with role='admin' → Can CRUD products → View all orders → Update order status → View user statistics.

## 4.2 Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| JWT token expiry | Added token refresh mechanism |
| Image upload | Used Cloudinary for image hosting |
| Payment failures | Added retry logic and error handling |
| Database connection | Used connection pooling with Mongoose |
| CORS errors | Configured CORS middleware in Express |

## 4.3 Future Enhancements

- Real-time order tracking with Socket.io
- Multi-language support (i18n)
- Advanced analytics dashboard
- Mobile app with React Native
- AI-powered furniture recommendations

---

# 📝 QUICK REFERENCE CHEAT SHEET

## HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK (Success) |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

## MongoDB Query Operators
```javascript
$eq    // equal
$ne    // not equal
$gt    // greater than
$lt    // less than
$in    // in array
$regex // pattern matching
```

## React Lifecycle
```javascript
// Mounting
constructor → render → componentDidMount (useEffect with [])

// Updating
setState → render → componentDidUpdate (useEffect with [deps])

// Unmounting
componentWillUnmount (useEffect cleanup)
```

## Git Commands (if asked)
```bash
git init                    # Initialize repo
git add .                   # Stage changes
git commit -m "message"     # Commit
git push origin main        # Push to remote
git pull origin main        # Pull updates
git branch feature-x        # Create branch
git checkout feature-x      # Switch branch
```

---

# 🎓 TIPS FOR VIVA

1. **Be confident** - You built this project, you know it best
2. **Explain concepts simply** - Don't use jargon unnecessarily
3. **Show enthusiasm** - Talk about features you're proud of
4. **Admit if unsure** - Better to say "I'm not sure but I think..." than guess wrong
5. **Connect to real-world** - Explain how this solves actual problems

**Sample Closing Statement:**
> "RentSpace demonstrates modern full-stack development practices with a React frontend, Node.js backend, and MongoDB database. The project showcases authentication, payment integration, email services, and responsive UI design - all essential skills for a full-stack developer."

---

**Good luck with your VIVA! 🎉**
