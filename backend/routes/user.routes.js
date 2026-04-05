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

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

export default router;
