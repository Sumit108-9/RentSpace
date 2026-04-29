import api from '../utils/api';

// Razorpay key ID (should be in environment variables in production)
const RAZORPAY_KEY_ID = 'rzp_test_SeqjX7UcUPZRwI';

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order
 * @param {number} amount - Amount in INR
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Receipt ID
 * @param {object} notes - Additional notes
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const response = await api.post('/payment/create-order', {
      amount,
      currency,
      receipt,
      notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

/**
 * Verify payment signature
 * @param {string} razorpay_order_id - Razorpay order ID
 * @param {string} razorpay_payment_id - Razorpay payment ID
 * @param {string} razorpay_signature - Razorpay signature
 */
export const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  try {
    const response = await api.post('/payment/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Initialize Razorpay checkout
 * @param {object} options - Razorpay checkout options
 */
export const openRazorpayCheckout = async (options) => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay script');
  }

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      ...options,
      handler: function (response) {
        // Payment successful
        resolve(response);
      },
      modal: {
        ondismiss: function () {
          // Modal closed without payment
          reject(new Error('Payment cancelled by user'));
        },
      },
    });

    razorpay.open();
  });
};

/**
 * Process payment with Razorpay
 * @param {number} amount - Amount in INR
 * @param {string} orderId - Order ID
 * @param {object} customerDetails - Customer details (name, email, phone)
 * @param {string} description - Payment description
 */
export const processPayment = async (amount, orderId, customerDetails, description = 'Furniture Rental Payment') => {
  try {
    // Step 1: Create Razorpay order
    const orderResponse = await createRazorpayOrder(amount, 'INR', orderId, {
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message || 'Failed to create payment order');
    }

    const { order } = orderResponse;

    // Step 2: Open Razorpay checkout
    const paymentResponse = await openRazorpayCheckout({
      amount: order.amount,
      currency: order.currency,
      name: 'RentSpace',
      description,
      order_id: order.id,
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      theme: {
        color: '#ff6b35',
      },
      notes: order.notes,
    });

    // Step 3: Verify payment signature
    const verificationResponse = await verifyPayment(
      paymentResponse.razorpay_order_id,
      paymentResponse.razorpay_payment_id,
      paymentResponse.razorpay_signature
    );

    if (verificationResponse.success) {
      return {
        success: true,
        payment_id: paymentResponse.razorpay_payment_id,
        order_id: paymentResponse.razorpay_order_id,
        signature: paymentResponse.razorpay_signature,
      };
    } else {
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

export default {
  createRazorpayOrder,
  verifyPayment,
  openRazorpayCheckout,
  loadRazorpayScript,
  processPayment,
};
