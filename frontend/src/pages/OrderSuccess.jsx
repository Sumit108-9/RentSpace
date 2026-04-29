import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ============================================
// RentSpace Order Success Page
// Order Confirmation after successful booking
// ============================================

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Fetch Order Details
  // ----------------------------------------
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 100px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#FAFAF8'
      }}>
        <div style={{ fontSize: 18, color: '#888780' }}>Loading order details...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: 800, 
      margin: '0 auto', 
      background: '#FAFAF8', 
      minHeight: 'calc(100vh - 100px)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          background: '#1D9E75', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 40
        }}>
          ✓
        </div>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 28, 
          fontWeight: 600, 
          color: '#1D9E75',
          marginBottom: 8
        }}>
          Booking Confirmed!
        </h2>
        <p style={{ fontSize: 16, color: '#888780' }}>
          Your furniture rental has been successfully booked.
        </p>
      </div>

      {/* Order Details Card */}
      <div style={{ 
        background: '#fff', 
        border: '1px solid #E8E6DF', 
        borderRadius: 12, 
        padding: 24,
        marginBottom: 20
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid #E8E6DF'
        }}>
          <div>
            <div style={{ fontSize: 14, color: '#888780', marginBottom: 4 }}>Order ID</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A' }}>#{orderId?.slice(-8).toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: '#888780', marginBottom: 4 }}>Order Date</div>
            <div style={{ fontSize: 16, color: '#2C2C2A' }}>
              {order ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A', marginBottom: 12 }}>Delivery Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: '#888780', marginBottom: 4 }}>Rental Period</div>
              <div style={{ fontSize: 14, color: '#2C2C2A' }}>
                {order ? `${new Date(order.rentalStartDate).toLocaleDateString('en-IN')} - ${new Date(order.rentalEndDate).toLocaleDateString('en-IN')}` : 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#888780', marginBottom: 4 }}>Delivery Address</div>
              <div style={{ fontSize: 14, color: '#2C2C2A' }}>
                {order?.shippingAddress?.houseNo}, {order?.shippingAddress?.street}, {order?.shippingAddress?.city}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div style={{ 
          padding: 16, 
          background: '#f5f5f5', 
          borderRadius: 8,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#888780' }}>Payment Method</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2C2A' }}>
              {order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: '#888780' }}>Total Amount</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1D9E75' }}>
              ₹{order?.totalAmount?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 8, borderLeft: '4px solid #1D9E75' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 8 }}>What's Next?</div>
          <ul style={{ fontSize: 13, color: '#555', margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>You'll receive a confirmation call within 24 hours</li>
            <li>Our team will schedule delivery on your chosen date</li>
            <li>Security deposit will be collected at delivery</li>
            <li>Save order ID for future reference</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          onClick={() => navigate('/products')}
          style={{ 
            flex: 1, 
            height: 48, 
            background: '#1D9E75', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            fontSize: 15, 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/orders')}
          style={{ 
            flex: 1, 
            height: 48, 
            background: '#fff', 
            color: '#1D9E75', 
            border: '2px solid #1D9E75', 
            borderRadius: 8, 
            fontSize: 15, 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
