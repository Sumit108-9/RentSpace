import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { createRazorpayOrder, loadRazorpayScript } from '../services/razorpay.service';
import { sendOrderNotification } from '../services/firebase.service';

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
    const rp = it.rentPrice || it.product?.monthlyRent || 0;
    const q = it.quantity || 1;
    const du = rental.durationUnit === 'days' ? rental.duration / 30 : rental.duration;
    return sum + (rp * q * du);
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
  const vcv = c => /^[0-9]{3}$/.test(c);
  const vu = u => /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/.test(u);

  const vCust = () => cust.fullName && vp(cust.phone) && ve(cust.email);
  const vAddr = () => addr.houseNo && addr.street && addr.city && addr.state && vpc(addr.pincode);
  const vPay = () => {
    if (pay === 'cod') return true;
    if (pay === 'card') return vcn(card.n) && vep(card.e) && vcv(card.v) && card.name;
    if (pay === 'upi') return vu(upi);
    if (pay === 'netbanking') return bank.length > 0;
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
        pincode: addr.pincode
      };

      const contactInfo = {
        fullName: cust.fullName,
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
        paymentDetails: payRes,
        totalAmount: total,
        itemsTotal: sub,
        deliveryFee: delivery,
        discount
      };

      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(body)
      });

      const d = await r.json();
      if (d.success && d.order) {
        clear();
        try { await sendOrderNotification(d.order._id, cust.fullName); } catch (e) { }
        nav(`/order-success/${d.order._id}`);
      } else {
        alert(d.message || 'Failed');
        setLoad(false);
      }
    } catch (e) {
      alert('Error');
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
        key: 'rzp_test_SeqjX7UcUPZRwI',
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
    } catch (e) { alert('Init failed'); setLoad(false); }
  };

  useEffect(() => { if (cart.length === 0) nav('/cart'); }, [cart.length, nav]);
  if (cart.length === 0) return null;

  const Inp = ({ v, onC, pl, e, ty = 'text' }) => (
    <>
      <input type={ty} value={v} onChange={onC} placeholder={pl} style={sx.ip(e)} />
      {e && <span style={sx.err}>{e}</span>}
    </>
  );

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
              <div><label style={sx.lb}>Full Name*</label><Inp v={cust.fullName} onC={e => setCust({ ...cust, fullName: e.target.value })} pl='Enter name' e={err.fullName} /></div>
              <div><label style={sx.lb}>Phone*</label><Inp v={cust.phone} onC={e => setCust({ ...cust, phone: e.target.value })} pl='10-digit' e={err.phone} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={sx.lb}>Email*</label><Inp v={cust.email} onC={e => setCust({ ...cust, email: e.target.value })} pl='email@example.com' e={err.email} /></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Delivery Address</h3>
            <div style={sx.r2(mobile)}>
              <div><label style={sx.lb}>House/Flat*</label><Inp v={addr.houseNo} onC={e => setAddr({ ...addr, houseNo: e.target.value })} pl='A-101' e={err.houseNo} /></div>
              <div><label style={sx.lb}>PIN*</label><Inp v={addr.pincode} onC={e => setAddr({ ...addr, pincode: e.target.value })} pl='6-digit' e={err.pincode} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={sx.lb}>Street*</label><Inp v={addr.street} onC={e => setAddr({ ...addr, street: e.target.value })} pl='Street name' e={err.street} /></div>
              <div><label style={sx.lb}>City*</label><Inp v={addr.city} onC={e => setAddr({ ...addr, city: e.target.value })} pl='City' e={err.city} /></div>
              <div><label style={sx.lb}>State*</label><Inp v={addr.state} onC={e => setAddr({ ...addr, state: e.target.value })} pl='State' e={err.state} /></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Rental Details</h3>
            <div style={sx.r3(mobile)}>
              <div><label style={sx.lb}>Start Date*</label><input type='date' value={rental.startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setRental({ ...rental, startDate: e.target.value })} style={sx.ip(false)} /></div>
              <div><label style={sx.lb}>Duration*</label><div style={{ display: 'flex', gap: 8 }}><input type='number' min='1' value={rental.duration} onChange={e => setRental({ ...rental, duration: parseInt(e.target.value) || 1 })} style={{ ...sx.ip(false), flex: 1 }} /><select value={rental.durationUnit} onChange={e => setRental({ ...rental, durationUnit: e.target.value })} style={{ ...sx.ip(false), background: '#fff' }}><option value='days'>Days</option><option value='months'>Months</option></select></div></div>
              <div><label style={sx.lb}>End Date</label><div style={{ ...sx.ip(false), display: 'flex', alignItems: 'center', background: '#f5f5f5' }}>{endDate()}</div></div>
            </div>
          </div>

          <div style={sx.card}>
            <h3 style={sx.h3}>Payment Method</h3>
            <label style={sx.po(pay === 'cod')}><input type='radio' name='pay' value='cod' checked={pay === 'cod'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>Cash on Delivery</div><div style={{ fontSize: 13, color: '#888780' }}>Pay on delivery</div></div></label>
            <label style={sx.po(pay === 'upi')}><input type='radio' name='pay' value='upi' checked={pay === 'upi'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>UPI</div><div style={{ fontSize: 13, color: '#888780' }}>Google Pay, PhonePe</div></div></label>
            {pay === 'upi' && <div style={{ padding: '0 0 16px 48px' }}><label style={sx.lb}>UPI ID*</label><input type='text' value={upi} onChange={e => setUpi(e.target.value)} placeholder='name@upi' style={{ ...sx.ip(err.pay), maxWidth: 300 }} /></div>}
            <label style={sx.po(pay === 'card')}><input type='radio' name='pay' value='card' checked={pay === 'card'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>Card</div><div style={{ fontSize: 13, color: '#888780' }}>Credit/Debit</div></div></label>
            {pay === 'card' && <div style={{ padding: '0 0 16px 48px' }}><div style={sx.r2(mobile)}><div style={{ gridColumn: '1/-1' }}><label style={sx.lb}>Card Number*</label><input type='text' value={card.n} onChange={e => setCard({ ...card, n: e.target.value.replace(/\D/g, '').slice(0, 16) })} placeholder='1234567890123456' style={sx.ip(err.pay)} /></div><div><label style={sx.lb}>Name*</label><input type='text' value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder='Name on card' style={sx.ip(false)} /></div><div><label style={sx.lb}>Expiry*</label><input type='text' value={card.e} onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4); setCard({ ...card, e: v }); }} placeholder='MM/YY' style={sx.ip(false)} /></div><div><label style={sx.lb}>CVV*</label><input type='password' maxLength={3} value={card.v} onChange={e => setCard({ ...card, v: e.target.value.replace(/\D/g, '').slice(0, 3) })} placeholder='123' style={sx.ip(false)} /></div></div></div>}
            <label style={sx.po(pay === 'netbanking')}><input type='radio' name='pay' value='netbanking' checked={pay === 'netbanking'} onChange={e => setPay(e.target.value)} style={{ width: 20, height: 20, accentColor: '#1D9E75' }} /><div><div style={{ fontSize: 16, fontWeight: 500 }}>Net Banking</div><div style={{ fontSize: 13, color: '#888780' }}>All major banks</div></div></label>
            {pay === 'netbanking' && <div style={{ padding: '0 0 16px 48px' }}><label style={sx.lb}>Select Bank*</label><select value={bank} onChange={e => setBank(e.target.value)} style={{ ...sx.ip(err.pay), maxWidth: 300, background: '#fff' }}><option value=''>--Select--</option>{banks.map(b => <option key={b} value={b}>{b}</option>)}</select></div>}
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
                    <img src={p.image?.[0] || '/placeholder.jpg'} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 12, color: '#888780' }}>Qty:{q}×₹{rp}</div></div>
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
            <button onClick={placeOrder} disabled={!allV() || load} style={sx.btn(!allV() || load)}>{load ? 'Processing...' : 'Pay Now'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
