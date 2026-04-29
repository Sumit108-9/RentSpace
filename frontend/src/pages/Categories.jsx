import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      name: 'Sofas',
      slug: 'sofa',
      count: '32',
      description: 'Comfortable seating for your living room',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      color: '#E1F5EE'
    },
    {
      name: 'Beds',
      slug: 'bed',
      count: '28',
      description: 'Quality beds for restful sleep',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      color: '#F5E6E1'
    },
    {
      name: 'Tables',
      slug: 'table',
      count: '24',
      description: 'Dining, coffee & study tables',
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600',
      color: '#E8F0E8'
    },
    {
      name: 'Chairs',
      slug: 'chair',
      count: '18',
      description: 'Accent, dining & office chairs',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600',
      color: '#F0E8E8'
    },
    {
      name: 'Storage',
      slug: 'wardrobe',
      count: '16',
      description: 'Wardrobes, bookshelves & cabinets',
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600',
      color: '#E8E8F0'
    },
    {
      name: 'Dining',
      slug: 'dining',
      count: '14',
      description: 'Complete dining sets & furniture',
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600',
      color: '#F5F0E1'
    }
  ];

  return (
    <div style={{ padding: '40px 64px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 48, 
          fontWeight: 600, 
          color: '#2C2C2A',
          marginBottom: 16 
        }}>
          Furniture Categories
        </h1>
        <p style={{ fontSize: 20, color: '#888780', maxWidth: 600, margin: '0 auto' }}>
          Browse our wide selection of premium furniture available for rent
        </p>
      </div>

      {/* Categories Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 32 
      }}>
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            to={`/products?category=${cat.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div 
              style={{ 
                background: '#fff', 
                border: '0.5px solid #E8E6DF', 
                borderRadius: 20, 
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Container */}
              <div style={{ 
                height: 280, 
                background: cat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.95)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#2C2C2A'
                }}>
                  {cat.count} items
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                <h3 style={{ 
                  fontSize: 24, 
                  fontWeight: 600, 
                  color: '#2C2C2A',
                  marginBottom: 8,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {cat.name}
                </h3>
                <p style={{ 
                  fontSize: 16, 
                  color: '#888780',
                  marginBottom: 16 
                }}>
                  {cat.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#1D9E75',
                  fontWeight: 500,
                  fontSize: 16
                }}>
                  <span>Explore Collection</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ 
        marginTop: 64, 
        textAlign: 'center',
        padding: '48px 32px',
        background: 'linear-gradient(135deg, #E1F5EE, #F5F4F0)',
        borderRadius: 20,
        border: '0.5px solid #E8E6DF'
      }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 32, 
          color: '#2C2C2A',
          marginBottom: 16 
        }}>
          Can't find what you're looking for?
        </h2>
        <p style={{ fontSize: 18, color: '#888780', marginBottom: 24 }}>
          Browse all our furniture in one place
        </p>
        <Link 
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 32px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 500,
            background: '#1D9E75',
            color: 'white',
            textDecoration: 'none',
            transition: 'all 0.15s'
          }}
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default Categories;
