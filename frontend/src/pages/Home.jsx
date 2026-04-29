import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=4');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products?.length > 0) {
            setFeaturedProducts(data.products.slice(0, 4));
            return;
          }
        }
      } catch (err) {
        // Silently fail, will show empty state
      }
    };
    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Sofas', slug: 'sofa', count: '32', icon: '🛋' },
    { name: 'Beds', slug: 'bed', count: '28', icon: '🛏' },
    { name: 'Tables', slug: 'table', count: '24', icon: '🪑' },
    { name: 'Chairs', slug: 'chair', count: '18', icon: '🪟' },
    { name: 'Appliances', slug: 'appliance', count: '16', icon: '🧺' },
  ];

  const sampleProducts = [
    { name: '3 Seater Sofa', price: '1,299', rating: '4.5', reviews: '120', icon: '🛋', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
    { name: 'Queen Size Bed', price: '1,599', rating: '4.6', reviews: '98', icon: '🛏', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600' },
    { name: 'Dining Table Set', price: '1,199', rating: '4.4', reviews: '78', icon: '🍽', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600' },
    { name: 'Accent Chair', price: '699', rating: '4.3', reviews: '40', icon: '🪑', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600' },
  ];

  const trustItems = [
    { icon: '🚚', label: 'Free Delivery', sub: 'On all orders' },
    { icon: '✅', label: 'Flexible Plans', sub: 'Short & long term' },
    { icon: '↩️', label: 'Easy Returns', sub: 'Hassle free' },
    { icon: '🏆', label: 'Quality Assured', sub: 'Premium quality' },
  ];

  const whyItems = [
    { icon: '💰', title: 'Affordable', sub: 'Best prices always' },
    { icon: '🔄', title: 'Hassle Free', sub: 'Easy booking & return' },
    { icon: '✅', title: 'Trusted', sub: 'Quality checked furniture' },
    { icon: '📞', title: 'Support 24/7', sub: 'We are always here' },
  ];

  const products = featuredProducts.length > 0 ? featuredProducts.map(p => ({
    name: p.name, price: p.monthlyRent ?? p.rentPrice, rating: p.rating || '4.5', reviews: p.numReviews || '24', icon: '🛋', id: p._id, image: p.images?.[0]
  })) : sampleProducts;

  return (
    <div style={{ padding: '32px 64px' }}>
      {/* Hero */}
      <section style={{ padding: '40px 0', maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 54, lineHeight: 1.1, marginBottom: 20, color: '#2C2C2A', fontWeight: 600 }}>
            Premium Furniture,<br /><span style={{ color: '#1D9E75' }}>Flexible Living</span>
          </h1>
          <p style={{ color: '#888780', fontSize: 18, marginBottom: 28, lineHeight: 1.5 }}>
            High quality furniture and appliances on rent. Flexible plans. Zero hassle.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 28px', borderRadius: 12, fontSize: 18, fontWeight: 500, background: '#1D9E75', color: 'white', textDecoration: 'none', border: '0.5px solid #1D9E75', transition: 'all 0.15s' }}>Explore Collection</Link>
            <Link to="/customize" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 28px', borderRadius: 12, fontSize: 18, fontWeight: 500, background: 'transparent', color: '#2C2C2A', textDecoration: 'none', border: '0.5px solid #E8E6DF', transition: 'all 0.15s' }}>▶ How It Works</Link>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#E1F5EE,#F5F4F0)', borderRadius: 20, height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', border: '0.5px solid #E8E6DF' }}>
          <img 
            src="/images/hero-sofa.jpg" 
            alt="Premium Teal Velvet Sofa" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ display: 'flex', gap: 0, borderTop: '0.5px solid #E8E6DF', background: '#fff', maxWidth: 1600, margin: '0 auto' }}>
        {trustItems.map((item, idx) => (
          <div key={idx} style={{ flex: 1, padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRight: idx < 3 ? '0.5px solid #E8E6DF' : 'none', fontSize: 14 }}>
            <div style={{ width: 44, height: 44, background: '#E1F5EE', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>{item.icon}</div>
            <div><div style={{ fontWeight: 500, color: '#2C2C2A', fontSize: 16 }}>{item.label}</div><div style={{ color: '#888780', fontSize: 13 }}>{item.sub}</div></div>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section style={{ padding: '56px 0', maxWidth: 1600, margin: '0 auto', background: '#fff', borderTop: '0.5px solid #E8E6DF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Featured Products</h2>
          <Link to="/products" style={{ fontSize: 18, color: '#1D9E75', textDecoration: 'none', transition: 'color 0.15s' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {products.map((product, idx) => (
            <Link to={product.id ? `/products/${product.id}` : '/products'} key={idx} style={{ textDecoration: 'none' }}>
              <div onMouseEnter={e => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.transform = 'translateY(-6px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E6DF'; e.currentTarget.style.transform = 'translateY(0)'; }} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ height: 250, background: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, position: 'relative', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : product.icon}
                  <div style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #E8E6DF' }}>
                    <Heart style={{ width: 22, height: 22, stroke: '#888780', fill: 'none' }} />
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 8, color: '#2C2C2A' }}>{product.name}</div>
                  <div style={{ color: '#085041', fontWeight: 600, fontSize: 22 }}>₹{product.price}<span style={{ color: '#888780', fontWeight: 400, fontSize: 14 }}>/month</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, color: '#888780', marginTop: 8 }}>
                    <span style={{ color: '#EF9F27' }}>★</span> {product.rating} ({product.reviews})
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section style={{ padding: '56px 0 80px', maxWidth: 1600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 26, fontWeight: 500, marginBottom: 28, color: '#2C2C2A', fontFamily: "'Playfair Display', serif" }}>Why Choose RentSpace?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 28 }}>
          {whyItems.map((item, idx) => (
            <div key={idx} style={{ background: '#fff', border: '0.5px solid #E8E6DF', borderRadius: 16, padding: 32, textAlign: 'center', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 20, marginBottom: 6, color: '#2C2C2A' }}>{item.title}</div>
              <div style={{ fontSize: 16, color: '#888780' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
