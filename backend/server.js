import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { createLogger } from './config/logger.js';

import authRoutes from './routes/auth.routes.js';
import googleAuthRoutes from './routes/googleAuth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';

dotenv.config();

const app = express();
const logger = createLogger();


// 🔐 SECURITY
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));


// ⚡ COMPRESSION
app.use(compression());


// 🚫 RATE LIMITING
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
}));


// 🔥 ✅ PROPER CORS (LOCAL + PRODUCTION)
const allowedOrigins = [
  "http://localhost:5173",
  "https://rent-space-pi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));


// 📦 BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 📊 LOGGING
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: { write: msg => logger.info(msg.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}


// 🚀 ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);


// ❤️ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    time: new Date(),
  });
});


// ❌ ERROR HANDLER
app.use((err, req, res, next) => {
  logger.error(err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});


// ❌ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


const PORT = process.env.PORT || 5000;


// START SERVER
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(' Server failed:', error.message);
    process.exit(1);
  }
};

startServer();