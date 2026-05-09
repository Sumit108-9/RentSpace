import api from '../utils/api';

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_Sk28HdT74t9GDF';

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (
  amount,
  currency = 'INR',
  receipt,
  notes = {}
) => {
  const response = await api.post('/payment/create-order', {
    amount,
    currency,
    receipt,
    notes,
  });
  return response.data;
};

export const verifyPayment = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  const response = await api.post('/payment/verify', {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};

export const openRazorpayCheckout = async (options) => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) throw new Error('Failed to load Razorpay');

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      ...options,
      handler: resolve,
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });

    razorpay.open();
  });
};

export const processPayment = async (
  amount,
  orderId,
  customerDetails,
  description = 'Furniture Rental Payment'
) => {
  const orderResponse = await createRazorpayOrder(amount, 'INR', orderId, {
    customer_name: customerDetails.name,
    customer_email: customerDetails.email,
    customer_phone: customerDetails.phone,
  });

  const { order } = orderResponse;

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
    theme: { color: '#ff6b35' },
  });

  return await verifyPayment(
    paymentResponse.razorpay_order_id,
    paymentResponse.razorpay_payment_id,
    paymentResponse.razorpay_signature
  );
};