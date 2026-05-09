import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { createRazorpayOrder, loadRazorpayScript } from '../services/razorpay.service';
import { sendOrderNotification } from '../services/firebase.service';
import api from '../utils/api';

const sx = {
  c: { padding: '40px 20px', maxWidth: 1200, margin: '0 auto', background: '#FAFAF8', minHeight: 'calc(100vh - 100px)', fontFamily: "'DM Sans',sans-serif" },
  h: { fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 600, marginBottom: 32, color: '#2C2C2A' },
  g: m => ({ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 420px', gap: 24 }),
  card: { background: '#fff', border: '1px solid #E8E6DF', borderRadius: 12, padding: 24 },
  h3: { fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#2C2C2A' },
  lb: { fontSize: 14, fontWeight: 500, color: '#888780', marginBottom: 8, display: 'block' },
  ip: e => ({ width: '100%', height: 48, padding: '0 14px', border: e ? '1px solid #e74c3c' : '1px solid #E8E6DF', borderRadius: 8, fontSize: 15 }),
  err: { fontSize: 12, color: '#e74c3c' },
  r2: m => ({ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 16 }),
  r3: m => ({ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr 1fr', gap: 16 }),
  po: a => ({ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: a ? '2px solid #1D9E75' : '1px solid #E8E6DF', borderRadius: 8, cursor: 'pointer', marginBottom: 12 }),
  btn: d => ({ width: '100%', height: 56, borderRadius: 8, fontSize: 17, fontWeight: 700, background: d ? '#c8e6c9' : '#1D9E75', color: 'white', border: 'none', cursor: d ? 'not-allowed' : 'pointer' }),
  skeleton: { background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s infinite', borderRadius: 8 }
};

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Bank of Baroda'];

// Input component - defined outside to prevent re-mounting
const Inp = ({ v, onC, pl, e, ty = 'text', id, name }) => (
  <>
    <input type={ty} id={id} name={name || id} value={v} onChange={onC} placeholder={pl} style={{ width: '100%', height: 48, padding: '0 14px', border: e ? '1px solid #e74c3c' : '1px solid #E8E6DF', borderRadius: 8, fontSize: 15 }} />
    {e && <span style={{ fontSize: 12, color: '#e74c3c' }}>{e}</span>}
  </>
);

const SkeletonCard = ({ mobile }) => (
  <div style={{ ...sx.card, opacity: 0.7 }}>
    <div style={{ ...sx.skeleton, height: 24, width: '60%', marginBottom: 20 }}></div>
    <div style={sx.r2(mobile)}>
      <div><div style={{ ...sx.skeleton, height: 48 }}></div></div>
      <div><div style={{ ...sx.skeleton, height: 48 }}></div></div>
      <div style={{ gridColumn: '1/-1' }}><div style={{ ...sx.skeleton, height: 48 }}></div></div>
    </div>
  </div>
);

const SkeletonSummary = () => (
  <div style={{ ...sx.card, position: 'sticky', top: 20 }}>
    <div style={{ ...sx.skeleton, height: 24, width: '50%', marginBottom: 20 }}></div>
    <div style={{ ...sx.skeleton, height: 60, marginBottom: 16 }}></div>
    <div style={{ ...sx.skeleton, height: 60, marginBottom: 16 }}></div>
    <div style={{ ...sx.skeleton, height: 48, marginTop: 20 }}></div>
  </div>
);

export default function Checkout() {
  const nav = useNavigate();
  const cart = useStore(st => st.getUserCart?.() || []);
  const clear = useStore(st => st.clearCart);
  const user = useStore(st => st.user);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => { window.removeEventListener('resize', h); clearTimeout(timer); };
  }, []);

  const [cust, setCust] = useState({ fullName: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [addr, setAddr] = useState({ houseNo: '', street: '', city: '', state: '', pincode: '' });
  const [rental, setRental] = useState({ startDate: new Date().toISOString().split('T')[0], duration: 3, durationUnit: 'months' });
  const [pay, setPay] = useState('cod');
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState(null);
  const [inst, setInst] = useState('');
  const [terms, setTerms] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [card, setCard] = useState({ n: '', e: '', v: '', name: '' });
  const [upi, setUpi] = useState('');
  const [bank, setBank] = useState('');

  const endDate = () => {
    const s = new Date(rental.startDate);
    const d = parseInt(rental.duration);
    const e = new Date(s);
    if (rental.durationUnit === 'days') e.setDate(e.getDate() + d);
    else e.setMonth(e.getMonth() + d);
    return e.toISOString().split('T')[0];
  };

  const sub = cart.reduce((sum, it) => {
    const rp = it.product?.monthlyRent || it.product?.rentPrice || 0;
    const q = it.quantity || 1;
    const months = rental.durationUnit === 'days' ? rental.duration / 30 : rental.duration;
    return sum + (rp * q * Math.max(1, months));
  }, 0);

  const delivery = sub > 5000 ? 0 : 299;
  const deposit = sub * 0.1;
  const discount = applied ? (applied.type === 'percentage' ? sub * (applied.value / 100) : applied.value) : 0;
  const total = sub + delivery + deposit - discount;

  const ve = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const vp = p => /^[0-9]{10}$/.test(p);
  const vpc = c => /^[0-9]{6}$/.test(c);
  const vcn = n => /^[0-9]{16}$/.test(n.replace(/\s/g, ''));
  const vep = e => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(e);

  // Optimized change handlers with useCallback for stable references
  const handleCustChange = useCallback((field) => (e) => {
    setCust(prev => ({ ...prev, [field]: e.target.value }));
    if (err[field]) setErr(prev => ({ ...prev, [field]: '' }));
  }, [err]);

  const handleAddrChange = useCallback((field) => (e) => {
    setAddr(prev => ({ ...prev, [field]: e.target.value }));
    if (err[field]) setErr(prev => ({ ...prev, [field]: '' }));
  }, [err]);

  const handleCardChange = useCallback((field) => (e) => {
    setCard(prev => ({ ...prev, [field]: e.target.value }));
    if (err[field]) setErr(prev => ({ ...prev, [field]: '' }));
  }, [err]);
  const vcv = c => /^[0-9]{3}$/.test(c);
  const vu = u => /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(u);

  const vCust = () => cust.fullName && vp(cust.phone) && ve(cust.email);
  const vAddr = () => addr.houseNo && addr.street && addr.city && addr.state && vpc(addr.pincode);
  const vPay = () => {
    if (pay === 'cod') return true;
    if (pay === 'razorpay') return true; // Razorpay handles validation
    return false;
  };
  const allV = () => vCust() && vAddr() && vPay() && terms;

  const applyPromo = () => {
    const c = promo.trim().toUpperCase();
    if (c === 'RENT10') { setApplied({ code: 'RENT10', type: 'percentage', value: 10 }); setErr({}); }
    else if (c === 'WELCOME50') { setApplied({ code: 'WELCOME50', type: 'fixed', value: 50 }); setErr({}); }
    else { setErr({ promo: 'Invalid' }); setApplied(null); }
  };

  const createOrder = async (payType, payRes = null) => {
    try {
      const orderItems = cart.map(it => ({
        productId: it.product?._id || it.productId,
        quantity: it.quantity || 1,
        rentalDuration: rental.duration,
        monthlyRent: it.rentPrice || it.product?.monthlyRent || 0
      }));

      const shippingAddress = {
        houseNo: addr.houseNo,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.pincode
      };

      const contactInfo = {
        name: cust.fullName,
        phone: cust.phone,
        email: cust.email
      };

      const body = {
        orderItems,
        shippingAddress,
        contactInfo,
        rentalStartDate: rental.startDate,
        rentalEndDate: endDate(),
        deliveryInstructions: inst,
        couponCode: applied?.code,
        paymentMethod: payType,
        paymentType: 'Full',
        paymentDetails: payRes,
        totalAmount: total,
        itemsTotal: sub,
        deliveryFee: delivery,
        discount
      };

      const { data: d } = await api.post('/orders', body);
      if (d.success && d.order) {
        clear();
        try { await sendOrderNotification(d.order._id, cust.fullName); } catch (e) { }
        nav(`/order-success/${d.order._id}`);
      } else {
        alert(d.message || 'Failed to create order. Server returned: ' + JSON.stringify(d));
        setLoad(false);
      }
    } catch (e) {
      console.error('Order creation error:', e);
      alert(e.response?.data?.message || e.message || 'Failed to create order. Please try again.');
      setLoad(false);
    }
  };

  const placeOrder = async () => {
    const ne = {};
    if (!vCust()) {
      if (!cust.fullName) ne.fullName = 'Required';
      if (!vp(cust.phone)) ne.phone = 'Invalid';
      if (!ve(cust.email)) ne.email = 'Invalid';
    }
    if (!vAddr()) {
      if (!addr.houseNo) ne.houseNo = 'Required';
      if (!addr.street) ne.street = 'Required';
      if (!addr.city) ne.city = 'Required';
      if (!addr.state) ne.state = 'Required';
      if (!vpc(addr.pincode)) ne.pincode = 'Invalid';
    }
    if (!vPay()) ne.pay = 'Complete payment details';
    if (!terms) ne.terms = 'Required';
    if (Object.keys(ne).length) { setErr(ne); return; }

    setLoad(true);
    if (pay === 'cod') { await createOrder('cod'); return; }

    const loaded = await loadRazorpayScript();
    if (!loaded) { alert('SDK failed'); setLoad(false); return; }

    try {
      const od = await createRazorpayOrder(Math.round(total * 100), 'INR', `r${Date.now()}`, {
        userId: user?._id,
        customerEmail: cust.email,
        customerPhone: cust.phone
      });

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_Sk28HdT74t9GDF',
        amount: od.amount,
        currency: od.currency,
        name: 'RentSpace',
        description: 'Furniture Rental',
        order_id: od.id,
        image: '/logo192.png',
        handler: async (rsp) => {
          await createOrder(pay, {
            razorpayPaymentId: rsp.razorpay_payment_id,
            razorpayOrderId: rsp.razorpay_order_id,
            razorpaySignature: rsp.razorpay_signature
          });
        },
        prefill: { name: cust.fullName, email: cust.email, contact: cust.phone },
        notes: { address: `${addr.houseNo},${addr.street},${addr.city}` },
        theme: { color: '#1D9E75' },
        modal: { ondismiss: () => { setLoad(false); alert('Cancelled'); } }
      });

      rzp.on('payment.failed', r => { alert(`Failed:${r.error.description}`); setLoad(false); });
      rzp.open();
    } catch (e) { 
      console.error('Razorpay init error:', e);
      alert('Payment initialization failed: ' + (e.message || e.response?.data?.message || 'Unknown error'));
      setLoad(false); 
    }
  };

  useEffect(() => { 
    if (cart.length === 0) nav('/cart'); 
    if (!user || !localStorage.getItem('token')) {
      alert('Please login to place an order');
      nav('/login');
    }
  }, [cart.length, nav, user]);
  if (cart.length === 0) return null;

  if (loading) {
    return (
      <div style={sx.c}>
        <h2 style={sx.h}>Checkout</h2>
        <div style={sx.g(mobile)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SkeletonCard mobile={mobile} />
            <SkeletonCard mobile={mobile} />
            <SkeletonCard mobile={mobile} />
          </div>
          <SkeletonSummary />
        </div>
        <style>{`@keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    );
  }

  return (
    <div style={sx.c}>
      <h2 style={sx.h}>Checkout</h2>
      <div style={sx.g(mobile)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={sx.card}>
            <h3 style={sx.h3}>Customer Details</h3>
            <div style={sx.r2(mobile)}>
              <div><label style={sx.lb}>Full Name*</label><Inp v={cust.fullName} onC={handleCustChange('fullName')} pl='Enter name' e={err.fullName} id='fullName' /></div>
              <div><label style={sx.lb}>Phone*</label><Inp v={cust.phone} onC={handleCustChange('phone')} pl='10-digit' e={err.phone} id='phone' /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={sx.lb}>Email*</label><Inp v={cust.email} onC={handleCustChange('email')} pl='email@example.com' e={err.email} id='email' /></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Delivery Address</h3>
            <div style={sx.r2(mobile)}>
              <div><label style={sx.lb}>House/Flat*</label><Inp v={addr.houseNo} onC={handleAddrChange('houseNo')} pl='A-101' e={err.houseNo} id='houseNo' /></div>
              <div><label style={sx.lb}>PIN*</label><Inp v={addr.pincode} onC={handleAddrChange('pincode')} pl='6-digit' e={err.pincode} id='pincode' /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={sx.lb}>Street*</label><Inp v={addr.street} onC={handleAddrChange('street')} pl='Street name' e={err.street} id='street' /></div>
              <div><label style={sx.lb}>City*</label><Inp v={addr.city} onC={handleAddrChange('city')} pl='City' e={err.city} id='city' /></div>
              <div><label style={sx.lb}>State*</label><Inp v={addr.state} onC={handleAddrChange('state')} pl='State' e={err.state} id='state' /></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Rental Details</h3>
            <div style={sx.r3(mobile)}>
              <div><label style={sx.lb}>Start Date*</label><input type='date' value={rental.startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setRental({ ...rental, startDate: e.target.value })} style={sx.ip(false)} /></div>
              <div><label style={sx.lb}>Duration*</label><div style={{ display: 'flex', gap: 8 }}><input type='number' min='1' value={rental.duration} onChange={e => setRental({ ...rental, duration: parseInt(e.target.value) || 1 })} style={{ ...sx.ip(false), width: 80, flexShrink: 0 }} /><select value={rental.durationUnit} onChange={e => setRental({ ...rental, durationUnit: e.target.value })} style={{ ...sx.ip(false), flex: 1, background: '#fff' }}><option value='days'>Days</option><option value='months'>Months</option></select></div></div>
              <div><label style={sx.lb}>End Date</label><div style={{ ...sx.ip(false), display: 'flex', alignItems: 'center', background: '#f5f5f5' }}>{endDate()}</div></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Payment Method</h3>
            <label style={sx.po(pay === 'cod')}><input type='radio' name='pay' value='cod' checked={pay === 'cod'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>Cash on Delivery (COD)</div><div style={{ fontSize: 13, color: '#888780' }}>Pay when you receive your furniture</div></div></label>
            <label style={sx.po(pay === 'razorpay')}><input type='radio' name='pay' value='razorpay' checked={pay === 'razorpay'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>Online Payment</div><div style={{ fontSize: 13, color: '#888780' }}>Pay via Razorpay (Card, UPI, Net Banking, Wallet)</div></div></label>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Additional Info</h3>
            <label style={sx.lb}>Delivery Instructions</label>
            <textarea value={inst} onChange={e => setInst(e.target.value)} placeholder='Building,floor,preferred time' rows={3} style={{ width: '100%', padding: 12, border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 15, resize: 'vertical', marginBottom: 16 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...sx.card, position: 'sticky', top: 20 }}>
            <h3 style={sx.h3}>Order Summary ({cart.length} items)</h3>
            <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 16 }}>
              {cart.map((it, idx) => {
                const p = it.product || it;
                const rp = p.monthlyRent || it.rentPrice || 0;
                const q = it.quantity || 1;
                return (
                  <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <img src={p.images?.[0] || p.image?.[0] || '/placeholder.jpg'} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none'; }} />
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 12, color: '#888780' }}>Qty: {q} × ₹{rp}/mo</div></div>
                    <div style={{ fontWeight: 600 }}>₹{(rp * q).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={sx.lb}>Total Rent</span><span style={{ fontWeight: 500 }}>₹{sub.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={sx.lb}>Delivery</span><span style={{ fontWeight: 500 }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={sx.lb}>Security Deposit</span><span style={{ fontWeight: 500 }}>₹{deposit.toLocaleString()}</span></div>
            {applied && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={sx.lb}>Discount ({applied.code})</span><span style={{ fontWeight: 500, color: '#1D9E75' }}>-₹{discount.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingTop: 16, borderTop: '2px solid #E8E6DF' }}><span style={{ fontSize: 18, fontWeight: 600 }}>Final Total</span><span style={{ fontSize: 20, fontWeight: 700, color: '#1D9E75' }}>₹{total.toLocaleString()}</span></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><input type='text' value={promo} onChange={e => setPromo(e.target.value)} placeholder='Promo code' style={{ flex: 1, height: 44, padding: '0 12px', border: '1px solid #E8E6DF', borderRadius: 8, fontSize: 14 }} /><button onClick={applyPromo} style={{ height: 44, padding: '0 20px', background: '#fff', border: '1px solid #1D9E75', borderRadius: 8, color: '#1D9E75', fontWeight: 600, cursor: 'pointer' }}>Apply</button></div>
            {err.promo && <div style={{ ...sx.err, marginBottom: 12 }}>{err.promo}</div>}{applied && <div style={{ background: '#e8f5e9', padding: 10, borderRadius: 6, marginBottom: 16, fontSize: 13, color: '#1D9E75' }}>✓ {applied.code} applied!</div>}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}><input type='checkbox' checked={terms} onChange={e => setTerms(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#1D9E75', marginTop: 2 }} /><span style={{ fontSize: 13, color: '#555' }}>I agree to the <a href='/terms' target='_blank' style={{ color: '#1D9E75' }}>Terms & Conditions</a> and <a href='/privacy' target='_blank' style={{ color: '#1D9E75' }}>Privacy Policy</a>*</span></div>
            {err.terms && <div style={{ ...sx.err, marginBottom: 12 }}>{err.terms}</div>}
            <button onClick={placeOrder} disabled={!allV() || load} style={sx.btn(!allV() || load)}>{load ? 'Processing...' : pay === 'cod' ? 'Place Order (COD)' : 'Pay Online'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
