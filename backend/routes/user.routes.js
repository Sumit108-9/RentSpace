import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToWishlist,
  removeFromWishlist
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { 
  validateUpdateUser, 
  validateUserId, 
  validateWishlist, 
  validateWishlistProductId 
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, validateUserId, getUserById);
router.put('/:id', protect, adminOnly, validateUpdateUser, updateUser);
router.delete('/:id', protect, adminOnly, validateUserId, deleteUser);
router.post('/wishlist', protect, validateWishlist, addToWishlist);
router.delete('/wishlist/:productId', protect, validateWishlistProductId, removeFromWishlist);

export default router;
