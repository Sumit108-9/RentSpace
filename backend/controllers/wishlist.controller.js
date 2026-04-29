import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

/**
 * @desc   Get the authenticated user's wishlist (populated)
 * @route  GET /api/wishlist
 * @access Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).populate({
      path: 'wishlist',
      select: 'name images monthlyRent category rating isActive',
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add a product to the wishlist (idempotent)
 * @route  POST /api/wishlist/add
 * @access Private
 * @body   { productId }
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const already = user.wishlist.some((id) => id.toString() === productId);
    if (!already) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate({
      path: 'wishlist',
      select: 'name images monthlyRent category rating isActive',
    });

    res.json({ success: true, message: already ? 'Already in wishlist' : 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Remove product from wishlist
 * @route  DELETE /api/wishlist/remove/:productId
 * @access Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    await user.populate({
      path: 'wishlist',
      select: 'name images monthlyRent category rating isActive',
    });

    res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Toggle a product in wishlist (convenience)
 * @route  POST /api/wishlist/toggle
 * @access Private
 * @body   { productId }
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existing = user.wishlist.some((id) => id.toString() === productId);
    if (existing) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();

    res.json({ success: true, inWishlist: !existing, wishlistCount: user.wishlist.length });
  } catch (error) {
    next(error);
  }
};
