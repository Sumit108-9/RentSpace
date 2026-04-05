import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Shop': [
      { name: 'Sofas', path: '/products?category=sofa' },
      { name: 'Beds', path: '/products?category=bed' },
      { name: 'Tables', path: '/products?category=table' },
      { name: 'Storage', path: '/products?category=storage' },
      { name: 'Dining', path: '/products?category=dining' },
    ],
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
    ],
    'Support': [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹5000' },
    { icon: Shield, title: 'Quality Assurance', desc: 'Premium quality items' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
    { icon: CreditCard, title: 'Secure Payment', desc: '100% secure checkout' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-secondary-400 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-800 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold">RentSpace</span>
              </Link>
              <p className="text-secondary-400 mb-6 max-w-sm">
                Premium furniture and appliance rentals for your home. Flexible monthly plans, free delivery, and hassle-free returns.
              </p>
              <div className="space-y-3">
                <a href="mailto:support@rentspace.com" className="flex items-center gap-3 text-secondary-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  support@rentspace.com
                </a>
                <a href="tel:+918001234567" className="flex items-center gap-3 text-secondary-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  +91 800-123-4567
                </a>
                <div className="flex items-center gap-3 text-secondary-400">
                  <MapPin className="w-5 h-5" />
                  Mumbai, Maharashtra, India
                </div>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-lg mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path}
                        className="text-secondary-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} RentSpace. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
