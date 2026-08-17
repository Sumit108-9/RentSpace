# Deployment Guide - RentSpace

This guide will help you deploy the RentSpace furniture rental application for production use.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (for production database)
- Razorpay account (for payment processing)
- Gmail account (for email services - optional)
- Deployment platform (Render, Vercel, Netlify, or similar)

## Environment Setup

### Backend Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```bash
cd backend
cp .env.example .env
```

Required variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your deployed frontend URL
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string (min 32 characters)
- `JWT_EXPIRE`: Token expiration time (default: 7d)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs

Optional variables:
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: For email services
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: For admin account creation
- `LOG_LEVEL`: Logging level (info, error, debug)

### Frontend Environment Variables

Copy `frontend/.env.example` to `frontend/.env` and fill in the values:

```bash
cd frontend
cp .env.example .env
```

Required variables:
- `VITE_API_URL`: Your deployed backend API URL
- `VITE_RAZORPAY_KEY`: Your Razorpay key ID

## Deployment Options

### Option 1: Render (Recommended for Backend)

#### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables from `backend/.env`
5. Deploy

#### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
4. Add environment variables from `frontend/.env`
5. Deploy

### Option 2: Netlify (Frontend) + Render (Backend)

#### Backend (Render)

Follow the Backend Deployment steps above.

#### Frontend (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Option 3: Single Platform (Render)

For both frontend and backend on Render:

#### Backend Service

1. Create Web Service as described above
2. Note the deployed URL

#### Frontend Service

1. Create another Web Service on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`
3. Add environment variables with your backend URL
4. Deploy

## MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for cloud deployment)
5. Get connection string and add to `MONGODB_URI`

## Razorpay Setup

1. Create a Razorpay account
2. Get API keys from Dashboard → Settings → API Keys
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to backend env
4. Add `VITE_RAZORPAY_KEY` to frontend env

## Email Setup (Optional)

For password reset emails:

1. Enable 2FA on your Gmail account
2. Generate an App Password
3. Add email credentials to backend env:
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASS`: your-app-password

## Production Build

### Local Build Test

```bash
# Install dependencies
npm run install-all

# Build frontend
npm run build

# Test backend
cd backend
npm start
```

### Verify Deployment

1. Check backend health: `https://your-backend-url.com/api/health`
2. Test frontend: Open your deployed frontend URL
3. Test user registration and login
4. Test product browsing
5. Test cart functionality

## Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS on all endpoints
- [ ] Set NODE_ENV to production
- [ ] Configure proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting (already configured)
- [ ] Set up database backups
- [ ] Monitor logs regularly

## Monitoring

The backend includes:
- Health check endpoint: `/api/health`
- Winston logging with file output in production
- Error tracking and logging

Check logs in your deployment platform's dashboard.

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check deployment logs for errors

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS configuration
- Ensure backend is running

### Payment errors
- Verify Razorpay keys are correct
- Check Razorpay dashboard for webhook issues
- Ensure frontend and backend keys match

## Scaling Considerations

For production scaling:
- Use MongoDB Atlas with appropriate tier
- Implement Redis for session management (if needed)
- Consider CDN for static assets
- Set up load balancing for high traffic
- Monitor database performance

## Support

For issues or questions:
- Check the API documentation: `backend/API_DOCUMENTATION.md`
- Review the main README: `README.md`
