import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

/**
 * Helper: get or create the active cart for the user.
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc   Get the authenticated user's cart
 * @route  GET /api/cart
 * @access Private
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id || req.user._id }).populate(
      'items.product',
      'name images monthlyRent category countInStock isActive'
    );

    if (!cart) {
      return res.json({
        success: true,
        cart: { items: [], totals: { subtotal: 0, itemCount: 0 } },
      });
    }

    const totals = cart.computeTotals();

    res.json({ success: true, cart: { _id: cart._id, items: cart.items, totals } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add item to cart (or increment qty if already present with same duration)
 * @route  POST /api/cart/add
 * @access Private
 * @body   { productId, quantity?, rentalDuration? }
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, rentalDuration = 1 } = req.body;

    const product = await Product.findOne({ _id: productId });
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await getOrCreateCart(req.user.id || req.user._id);

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.rentalDuration === rentalDuration
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        rentalDuration: Number(rentalDuration),
      });
    }

    await cart.save();
    await cart.populate(
      'items.product',
      'name images monthlyRent category countInStock isActive'
    );

    const totals = cart.computeTotals();
    res.json({ success: true, message: 'Added to cart', cart: { _id: cart._id, items: cart.items, totals } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update quantity or rentalDuration for a cart item
 * @route  PUT /api/cart/update
 * @access Private
 * @body   { itemId, quantity?, rentalDuration? }
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity, rentalDuration } = req.body;

    const cart = await Cart.findOne({ user: req.user.id || req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if (quantity != null) {
      if (quantity <= 0) {
        cart.items.pull(itemId);
      } else {
        item.quantity = Number(quantity);
      }
    }
    if (rentalDuration != null) item.rentalDuration = Number(rentalDuration);

    await cart.save();
    await cart.populate(
      'items.product',
      'name images monthlyRent category countInStock isActive'
    );

    const totals = cart.computeTotals();
    res.json({ success: true, cart: { _id: cart._id, items: cart.items, totals } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Remove a specific product (all variants) from cart
 * @route  DELETE /api/cart/remove/:productId
 * @access Private
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id || req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate(
      'items.product',
      'name images monthlyRent category countInStock isActive'
    );

    const totals = cart.computeTotals();
    res.json({ success: true, cart: { _id: cart._id, items: cart.items, totals } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Empty the cart
 * @route  DELETE /api/cart
 * @access Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id || req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared', cart: { items: [], totals: { subtotal: 0, itemCount: 0 } } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Merge guest cart (from localStorage) into user's DB cart — called right after login
 * @route  POST /api/cart/merge
 * @access Private
 * @body   { items: [{ productId, quantity, rentalDuration }] }
 */
export const mergeCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items must be an array' });
    }

    const cart = await getOrCreateCart(req.user.id || req.user._id);

    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it.productId)) continue;
      const existing = cart.items.find(
        (i) => i.product.toString() === it.productId && i.rentalDuration === (it.rentalDuration || 1)
      );
      if (existing) {
        existing.quantity += Number(it.quantity || 1);
      } else {
        cart.items.push({
          product: it.productId,
          quantity: Number(it.quantity || 1),
          rentalDuration: Number(it.rentalDuration || 1),
        });
      }
    }

    await cart.save();
    await cart.populate(
      'items.product',
      'name images monthlyRent category countInStock isActive'
    );

    const totals = cart.computeTotals();
    res.json({ success: true, cart: { _id: cart._id, items: cart.items, totals } });
  } catch (error) {
    next(error);
  }
};
