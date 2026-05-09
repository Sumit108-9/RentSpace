import { body, param, validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User Registration Validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email must not exceed 100 characters'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number (e.g., +91 98765 43210 or 9876543210)'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),
  
  handleValidationErrors
];

// User Login Validation
export const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

// Update Profile Validation
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email must not exceed 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number (e.g., +91 98765 43210 or 9876543210)'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),
  
  handleValidationErrors
];

// Update User (Admin) Validation
export const validateUpdateUser = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  
  handleValidationErrors
];

// User ID Parameter Validation
export const validateUserId = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  
  handleValidationErrors
];

export const validateOrderCreation = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order items must be an array with at least one item'),
  body('orderItems.*.productId').notEmpty().withMessage('Product ID is required'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('contactInfo.name').notEmpty().withMessage('Contact name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('paymentMethod').isIn(['card', 'upi', 'netbanking', 'cod', 'razorpay']).withMessage('Invalid payment method'),
  body('paymentType').isIn(['Full', 'Installment']).withMessage('Payment type must be Full or Installment'),
  body('rentalStartDate').isISO8601().withMessage('Valid rental start date is required'),
  body('rentalEndDate').isISO8601().withMessage('Valid rental end date is required'),
  
  handleValidationErrors
];

export const validateInstallmentPayment = [
  body('paymentMethod').isIn(['card', 'upi', 'netbanking', 'cod', 'razorpay']).withMessage('Invalid payment method'),
  body('paymentId').optional().isString().withMessage('Payment ID must be a string'),
  
  handleValidationErrors
];

// Product Validation
export const validateProductCreation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 2000 }).withMessage('Description must be between 5 and 2000 characters'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['sofa', 'bed', 'table', 'chair', 'wardrobe', 'decor', 'dining', 'storage'])
    .withMessage('Invalid category'),
  
  body('monthlyRent')
    .notEmpty().withMessage('Monthly rent is required')
    .isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
  
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 }).withMessage('Security deposit must be a non-negative number'),
  
  body('countInStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock count must be a non-negative integer'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

export const validateProductUpdate = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .trim(),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 2000 }).withMessage('Description must be between 5 and 2000 characters'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['sofa', 'bed', 'table', 'chair', 'wardrobe', 'decor', 'dining', 'storage'])
    .withMessage('Invalid category'),
  
  body('monthlyRent')
    .optional()
    .isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number'),
  
  body('securityDeposit')
    .optional()
    .isFloat({ min: 0 }).withMessage('Security deposit must be a non-negative number'),
  
  body('countInStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock count must be a non-negative integer'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

export const validateProductId = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .trim(),

  handleValidationErrors
];

// Review Validation
export const validateReview = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters'),
  
  handleValidationErrors
];

// Order Validation
export const validateOrderId = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
  
  handleValidationErrors
];

export const validateOrderStatusUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'in-transit', 'delivered', 'cancelled', 'rejected'])
    .withMessage('Invalid status value'),
  
  handleValidationErrors
];

// Admin Login Validation
export const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// Wishlist Validation
export const validateWishlist = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  handleValidationErrors
];

export const validateWishlistProductId = [
  param('productId')
    .isMongoId().withMessage('Invalid product ID'),
  
  handleValidationErrors
];
