import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Truck, Shield, Headphones, Star, Quote } from 'lucide-react';
import { productApi } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import ProductCarousel from '../components/common/ProductCarousel';
import PromotionalBanners from '../components/common/PromotionalBanners';
import SectionTitle from '../components/common/SectionTitle';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState('rent');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getFeaturedProducts(),
          productApi.getCategories()
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryImages = {
    sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    table: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400',
    chair: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
    wardrobe: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400',
    decor: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400',
    dining: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400',
    storage: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400'
  };

  const howItWorks = [
    {
      icon: Package,
      title: 'Choose Your Items',
      description: 'Browse our collection and select furniture that fits your style and needs.'
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'We deliver and set up everything at your doorstep within 3-5 business days, free of charge.'
    },
    {
      icon: Shield,
      title: 'Use & Enjoy',
      description: 'Enjoy your premium furniture with our quality assurance and maintenance support.'
    },
    {
      icon: Headphones,
      title: 'Easy Returns',
      description: 'When you\'re done, schedule a pickup. Extend, buy, or return - it\'s that simple!'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Working Professional',
      content: 'RentSpace made furnishing my new apartment so easy! The quality is excellent and the monthly payments fit my budget perfectly.',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Startup Founder',
      content: 'We furnished our entire office through RentSpace. The process was seamless and saved us a ton of capital. Highly recommended!',
      rating: 5
    },
    {
      name: 'Ananya Patel',
      role: 'Student',
      content: 'As a student, buying furniture wasn\'t an option. RentSpace gave me access to premium furniture at affordable monthly rates.',
      rating: 5
    }
  ];

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600"
            alt="Modern living room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 via-secondary-900/50 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-full mb-6">
              New Collection Available
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Furniture,
              <br />
              <span className="text-primary-400">Affordable Rentals</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-200 mb-8 max-w-lg">
              Transform your space with our curated collection of premium furniture. 
              Flexible monthly plans starting from just ₹399/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary text-lg py-4 px-8">
                Explore Furniture
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <SectionTitle 
            title="Shop by Category"
            subtitle="Find exactly what you need from our wide range of categories"
            centered
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category}`}
                  className="group block relative aspect-square rounded-2xl overflow-hidden"
                >
                  <img
                    src={categoryImages[category] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg capitalize">{category}</h3>
                    <span className="text-secondary-300 text-sm">Explore Now</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductCarousel 
        products={featuredProducts}
        title="Featured Products"
        subtitle="Handpicked premium items for your home"
        mode={mode}
      />

      {/* How It Works */}
      <section className="py-16 bg-theme-secondary">
        <div className="container-custom">
          <SectionTitle 
            title="How It Works"
            subtitle="Renting furniture has never been easier"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-theme-primary">{step.title}</h3>
                <p className="text-theme-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-12 bg-primary-600">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-theme-secondary">
        <div className="container-custom">
          <SectionTitle 
            title="What Our Customers Say"
            subtitle="Real stories from real renters"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                <Quote className="w-10 h-10 text-primary-200 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-theme-secondary mb-6">{testimonial.content}</p>
                <div>
                  <div className="font-semibold text-theme-primary">{testimonial.name}</div>
                  <div className="text-sm text-theme-muted">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who have discovered the smart way to furnish their homes.
            </p>
            <Link to="/products" className="btn-primary text-lg py-4 px-8 inline-flex">
              Start Renting Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
