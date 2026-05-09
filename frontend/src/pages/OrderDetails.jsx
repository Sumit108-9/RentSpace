import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Calendar, Phone, Mail, User } from 'lucide-react';
import api from '../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        const data = response.data;
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Failed to load order details');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const response = await api.put(`/orders/${id}/cancel`);
      const data = response.data;
      if (data.success) {
        setOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
        setShowCancelConfirm(false);
        alert('Order cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const formatCurrency = (amount) => {
    return '₹' + (amount || 0).toLocaleString('en-IN');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#FAEEDA', color: '#854F0B', icon: Package },
      confirmed: { bg: '#E1F5EE', color: '#1D9E75', icon: CheckCircle },
      shipped: { bg: '#E6F1FB', color: '#185FA5', icon: Truck },
      delivered: { bg: '#E1F5EE', color: '#085041', icon: CheckCircle },
      cancelled: { bg: '#FCEBEB', color: '#B91C1C', icon: XCircle }
    };
    return colors[status] || colors.pending;
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been confirmed' },
      { key: 'confirmed', label: 'Processing', description: 'Preparing your items' },
      { key: 'shipped', label: 'Shipped', description: 'Items are on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Items delivered successfully' }
    ];
    
    const statusIndex = steps.findIndex(s => s.key === status);
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= statusIndex,
      current: idx === statusIndex
    }));
  };

  const canCancel = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 64px', background: '#FAFAF8', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 18, color: '#888780' }}>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '40px 64px', background: '#FAFAF8', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer', fontSize: 16, marginBottom: 20 }}>
            <ArrowLeft style={{ width: 20, height: 20 }} /> Back to Orders
          </button>
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '20px 24px', borderRadius: 12, fontSize: 16, textAlign: 'center' }}>
            {error || 'Order not found'}
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(order.orderStatus);
  const StatusIcon = statusStyle.icon;
  const trackingSteps = getTrackingSteps(order.orderStatus);

  return (
    <div style={{ padding: '40px 64px', background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Back Button */}
        <button onClick={() => navigate('/orders')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#1D9E75', cursor: 'pointer', fontSize: 16, marginBottom: 24 }}>
          <ArrowLeft style={{ width: 20, height: 20 }} /> Back to Orders
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, color: '#2C2C2A', marginBottom: 8 }}>
              Order #{order.orderNumber || order._id}
            </h1>
            <div style={{ fontSize: 15, color: '#888780' }}>
              Placed on {formatDate(order.createdAt)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
            <StatusIcon style={{ width: 18, height: 18 }} />
            {order.orderStatus}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400 }}>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#2C2C2A' }}>Cancel Order?</div>
              <div style={{ fontSize: 15, color: '#888780', marginBottom: 24 }}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowCancelConfirm(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#F5F4F0', color: '#2C2C2A', border: 'none', cursor: 'pointer' }}>
                  No, Keep It
                </button>
                <button onClick={handleCancelOrder} disabled={cancelling} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 15, fontWeight: 500, background: '#B91C1C', color: '#fff', border: 'none', cursor: 'pointer', opacity: cancelling ? 0.7 : 1 }}>
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Left Column */}
          <div>
            {/* Tracking Timeline */}
            {order.orderStatus !== 'cancelled' && (
              <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: '#2C2C2A' }}>Order Tracking</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {trackingSteps.map((step, idx) => (
                    <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {/* Connector Line */}
                      {idx < trackingSteps.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          top: 16,
                          left: '50%',
                          right: '-50%',
                          height: 2,
                          background: step.completed ? '#1D9E75' : '#E8E6DF',
                          zIndex: 1
                        }} />
                      )}
                      {/* Step Circle */}
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: step.completed ? '#1D9E75' : '#fff',
                        border: `2px solid ${step.completed ? '#1D9E75' : '#E8E6DF'}`,
                        zIndex: 2,
                        marginBottom: 8
                      }}>
                        {step.completed ? (
                          <CheckCircle style={{ width: 16, height: 16, color: '#fff' }} />
                        ) : (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8E6DF' }} />
                        )}
                      </div>
                      {/* Step Label */}
                      <div style={{ fontSize: 12, fontWeight: step.current ? 600 : 400, color: step.completed ? '#2C2C2A' : '#888780', textAlign: 'center' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#888780', textAlign: 'center', marginTop: 4 }}>
                        {step.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.orderStatus === 'cancelled' && (
              <div style={{ background: '#FCEBEB', border: '0.5px solid #FECACA', borderRadius: 12, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <XCircle style={{ width: 24, height: 24, color: '#B91C1C' }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#B91C1C' }}>Order Cancelled</div>
                  <div style={{ fontSize: 14, color: '#888780' }}>This order has been cancelled.</div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#2C2C2A' }}>Order Items</div>
              {order.orderItems?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: idx < order.orderItems.length - 1 ? '0.5px solid #E8E6DF' : 'none' }}>
                  <div style={{ width: 80, height: 80, background: '#F5F4F0', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🪑</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#2C2C2A', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: '#888780', marginBottom: 8 }}>
                      Rental Duration: {item.rentalDuration} months
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 14, color: '#888780' }}>Qty: {item.quantity || 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#085041' }}>
                        {formatCurrency(item.monthlyRent * item.rentalDuration * (item.quantity || 1))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#2C2C2A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin style={{ width: 20, height: 20 }} /> Shipping Address
              </div>
              <div style={{ fontSize: 15, color: '#2C2C2A', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{order.shippingAddress?.name || order.contactInfo?.name}</div>
                <div>{order.shippingAddress?.address}</div>
                <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#888780' }}>
                  <Phone style={{ width: 14, height: 14 }} /> {order.contactInfo?.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Order Summary */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#2C2C2A' }}>Order Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
                <span style={{ color: '#888780' }}>Items Total</span>
                <span style={{ color: '#2C2C2A' }}>{formatCurrency(order.itemsTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
                <span style={{ color: '#888780' }}>Delivery Fee</span>
                <span style={{ color: '#2C2C2A' }}>{formatCurrency(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
                  <span style={{ color: '#888780' }}>Discount</span>
                  <span style={{ color: '#1D9E75' }}>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div style={{ borderTop: '0.5px solid #E8E6DF', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
                <span style={{ color: '#2C2C2A' }}>Total</span>
                <span style={{ color: '#085041' }}>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#2C2C2A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard style={{ width: 20, height: 20 }} /> Payment
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 }}>
                <span style={{ color: '#888780' }}>Method</span>
                <span style={{ color: '#2C2C2A', textTransform: 'uppercase' }}>{order.paymentInfo?.method || 'COD'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ color: '#888780' }}>Status</span>
                <span style={{ color: order.isPaid ? '#1D9E75' : '#854F0B', fontWeight: 500 }}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            {canCancel(order.orderStatus) && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  background: '#FEE2E2',
                  color: '#B91C1C',
                  border: '1px solid #FECACA',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <XCircle style={{ width: 18, height: 18 }} />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
