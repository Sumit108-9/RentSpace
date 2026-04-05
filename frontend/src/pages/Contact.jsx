import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We will get back to you soon.');
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 80 1234 5678'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['support@rentspace.com', 'info@rentspace.com'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Furniture Lane', 'Koramangala, Bangalore', 'Karnataka 560034'],
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 6:00 PM'],
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Have questions about furniture rentals? Need help with your order? 
            Our team is here to assist you. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm text-center"
            >
              <div className={`w-14 h-14 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-secondary-600 text-sm">{detail}</p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className="text-secondary-600">Thank you for reaching out. We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input w-full"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="rental">Rental Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input w-full"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Map & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Map Placeholder */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="bg-secondary-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600">Google Maps Integration</p>
                  <p className="text-secondary-500 text-sm">123 Furniture Lane, Bangalore</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/products" className="text-primary-600 hover:underline">Browse Products</Link>
                <Link to="/orders" className="text-primary-600 hover:underline">Track Order</Link>
                <Link to="/faq" className="text-primary-600 hover:underline">FAQs</Link>
                <Link to="/terms" className="text-primary-600 hover:underline">Terms & Conditions</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
