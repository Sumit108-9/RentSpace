import React from 'react';
import { Leaf, RefreshCw, ShoppingBag, Truck } from 'lucide-react';

const About = () => {
  const sx = {
    container: { maxWidth: 900, margin: '0 auto', padding: '80px 24px', fontFamily: "'DM Sans', sans-serif", color: '#2C2C2A' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 600, textAlign: 'center', marginBottom: 60 },
    section: { marginBottom: 60 },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 24, position: 'relative', display: 'inline-block' },
    underline: { content: '', position: 'absolute', bottom: -8, left: 0, width: 60, height: 2, background: '#1D9E75' },
    text: { fontSize: 18, lineHeight: 1.8, color: '#555', marginBottom: 20 },
    highlight: { fontWeight: 600, color: '#1D9E75' },
    cards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 40 },
    card: { background: '#FAFAF8', padding: 32, borderRadius: 12, textAlign: 'center', border: '1px solid #E8E6DF' },
    cardTitle: { fontSize: 18, fontWeight: 600, marginTop: 16, marginBottom: 12, color: '#2C2C2A' },
    cardText: { fontSize: 15, color: '#666', lineHeight: 1.6 },
    iconBox: { width: 56, height: 56, background: '#E1F5EE', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
    closing: { background: '#1D9E75', color: 'white', padding: '48px 40px', borderRadius: 16, textAlign: 'center', marginTop: 60 },
    closingText: { fontSize: 20, lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }
  };

  return (
    <div style={sx.container}>
      <h1 style={sx.title}>About Us</h1>

      <div style={sx.section}>
        <h2 style={sx.sectionTitle}>
          The Founding Story
          <span style={sx.underline}></span>
        </h2>
        <p style={sx.text}>
          RentSpace was born from a simple frustration — <span style={sx.highlight}>buying furniture is expensive, inflexible, and permanent</span>. 
          We saw people struggling with bulky purchases, moving hassles, and furniture that never quite fit their evolving lifestyle.
        </p>
        <p style={sx.text}>
          So we asked: <span style={{ fontStyle: 'italic' }}>What if furniture could be as flexible as your life?</span> 
          Today, RentSpace offers a smarter way to furnish your home — with the freedom to rent, swap, and upgrade without commitment.
        </p>
      </div>

      <div style={sx.section}>
        <h2 style={sx.sectionTitle}>
          Who are we?
          <span style={sx.underline}></span>
        </h2>
        <p style={sx.text}>
          We're a team of design enthusiasts and problem-solvers on a mission to make <span style={sx.highlight}>modern living accessible to everyone</span>. 
          No heavy investments. No buyer's remorse. Just beautiful furniture, delivered to your door, on your terms.
        </p>
      </div>

      <div style={sx.cards}>
        <div style={sx.card}>
          <div style={sx.iconBox}><ShoppingBag size={28} color="#1D9E75" /></div>
          <h3 style={sx.cardTitle}>Freedom of Choice</h3>
          <p style={sx.cardText}>Wide range of premium furniture curated for modern lifestyles and every room in your home.</p>
        </div>
        <div style={sx.card}>
          <div style={sx.iconBox}><Truck size={28} color="#1D9E75" /></div>
          <h3 style={sx.cardTitle}>Freedom of Access</h3>
          <p style={sx.cardText}>Rent, subscribe, or buy — choose what works for you with transparent pricing and no hidden fees.</p>
        </div>
        <div style={sx.card}>
          <div style={sx.iconBox}><RefreshCw size={28} color="#1D9E75" /></div>
          <h3 style={sx.cardTitle}>Freedom to Change</h3>
          <p style={sx.cardText}>Easy upgrades and hassle-free returns. Your style evolves — your furniture should too.</p>
        </div>
      </div>

      <div style={sx.closing}>
        <p style={sx.closingText}>
          <strong style={{ fontSize: 24 }}>Rent. Use. Upgrade. Repeat.</strong><br /><br />
          We're here to save you time, cost, and effort — so you can focus on living, not logistics. 
          Welcome to furniture freedom. Welcome to <strong>RentSpace</strong>.
        </p>
      </div>
    </div>
  );
};

export default About;
