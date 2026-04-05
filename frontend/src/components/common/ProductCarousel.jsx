import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ products, title, subtitle, mode = 'rent' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            {subtitle && <p style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage + 1.5)}%)` }}
          >
            {products.map((product) => (
              <div 
                key={product._id}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerPage - 1.5}%` }}
              >
                <ProductCard product={product} mode={mode} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCardSimple = ({ product }) => (
  <div className="card group">
    <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <a href={`/products/${product._id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </a>
    </div>
    <div className="p-4" style={{ backgroundColor: 'var(--surface)' }}>
      <a href={`/products/${product._id}`}>
        <h3 className="font-semibold mb-1 line-clamp-1 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
      </a>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
          ₹{product.monthlyRent}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>
        </span>
      </div>
    </div>
  </div>
);

export default ProductCarousel;
