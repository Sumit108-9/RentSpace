import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import api from '../utils/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const res = await api.post('/auth/register', registerData);
      const { token, user } = res.data;
      
      setAuth(user, token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Join RentSpace and start renting today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`input pl-11 ${errors.name ? 'input-error' : ''}`}
                />
              </div>
              {errors.name && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className={`input pl-11 ${errors.phone ? 'input-error' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 chars)"
                  className={`input pl-11 pr-11 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`input pl-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5" 
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  I agree to the{' '}
                  <Link to="/terms" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
