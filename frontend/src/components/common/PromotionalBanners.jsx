import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Home, Palette } from 'lucide-react';

const PromotionalBanners = () => {
  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Large Banner - Rent Furniture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 relative overflow-hidden rounded-2xl group"
          >
            <div className="relative h-[400px] lg:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"
                alt="Modern living room furniture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <span className="inline-block px-4 py-1.5 bg-accent-500 text-white text-sm font-semibold rounded-full mb-4">
                  Starting at ₹999/month
                </span>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Rent Furniture & Home Essentials
                </h3>
                <p className="text-white/80 text-lg mb-6 max-w-md">
                  Transform your space without the commitment. Premium furniture delivered to your doorstep.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-secondary-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all"
                >
                  <Home className="w-5 h-5" />
                  Explore Rentals
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Customize Furniture Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl group flex-1"
            >
              <div className="relative h-full min-h-[200px]">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                  alt="Customize furniture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/70" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-5 h-5 text-accent-400" />
                    <span className="text-accent-400 text-sm font-semibold uppercase tracking-wide">
                      New Feature
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Customize Your Furniture
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Choose colors, fabrics, and finishes to match your style.
                  </p>
                  <Link
                    to="/customize"
                    className="inline-flex items-center gap-2 w-fit bg-accent-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-accent-600 transition-all"
                  >
                    Start Customizing
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Buy Furniture Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl group flex-1"
            >
              <div className="relative h-full min-h-[200px]">
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
                  alt="Buy furniture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-700/70" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm font-semibold uppercase tracking-wide">
                      Up to 40% Off
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Buy Furniture
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Own premium pieces at unbeatable prices. Limited time offers.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 w-fit bg-green-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-all"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
