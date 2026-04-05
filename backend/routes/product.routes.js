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

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

export default router;
