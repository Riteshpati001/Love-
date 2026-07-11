import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { FaHeart, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px 40px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 50,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaHeart style={{ fontSize: 50, color: '#FF4D6D', marginBottom: 15 }} />
          </motion.div>
          <h2 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 36,
            background: 'linear-gradient(135deg, #FF4D6D, #FFC0CB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Join HeartLink
          </h2>
          <p style={{ color: '#999', marginTop: 8 }}>Create your account and start your love story</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(255, 77, 109, 0.1)',
              border: '1px solid rgba(255, 77, 109, 0.3)',
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              color: '#FF4D6D',
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#ccc', fontSize: 14 }}>Name</label>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '0 16px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <FaUser style={{ color: '#666', marginRight: 12 }} />
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your name" style={{
                  flex: 1, background: 'none', border: 'none', color: '#fff',
                  padding: '14px 0', fontSize: 15,
                }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#ccc', fontSize: 14 }}>Email</label>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '0 16px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <FaEnvelope style={{ color: '#666', marginRight: 12 }} />
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" style={{
                  flex: 1, background: 'none', border: 'none', color: '#fff',
                  padding: '14px 0', fontSize: 15,
                }} />
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#ccc', fontSize: 14 }}>Password</label>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)',
              borderRadius: 12, padding: '0 16px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <FaLock style={{ color: '#666', marginRight: 12 }} />
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="At least 6 characters" style={{
                  flex: 1, background: 'none', border: 'none', color: '#fff',
                  padding: '14px 0', fontSize: 15,
                }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.7 : 1, fontSize: 16, padding: '16px' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 25, color: '#999', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF4D6D', fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
