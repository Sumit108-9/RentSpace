import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { 
  validateProductCreation, 
  validateProductUpdate, 
  validateProductId,
  validateReview 
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', validateProductId, getProductById);

router.post('/', protect, adminOnly, validateProductCreation, createProduct);
router.put('/:id', protect, adminOnly, validateProductUpdate, updateProduct);
router.delete('/:id', protect, adminOnly, validateProductId, deleteProduct);
router.post('/:id/reviews', protect, validateReview, addReview);

export default router;
