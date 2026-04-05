import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Customize = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-theme-secondary hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette className="w-10 h-10 text-accent-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            Customize Your Furniture
          </h1>
          <p className="text-xl text-theme-secondary max-w-2xl mx-auto">
            Coming Soon - Design your perfect piece with our customization options
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Palette,
              title: 'Choose Your Colors',
              description: 'Select from hundreds of fabric and finish options to match your style.'
            },
            {
              icon: Sparkles,
              title: 'Premium Materials',
              description: 'Upgrade to premium woods, metals, and fabrics for a truly unique piece.'
            },
            {
              icon: Check,
              title: 'Made to Order',
              description: 'Every customized piece is handcrafted to your exact specifications.'
            }
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="card p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-theme-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-theme-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-theme-muted mb-6">
            Want to be notified when customization launches?
          </p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            Browse Our Collection
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Customize;
