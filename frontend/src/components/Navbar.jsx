import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FaHeart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(26, 26, 46, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 77, 109, 0.2)',
        padding: '0 20px',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaHeart style={{ color: '#FF4D6D', fontSize: 28 }} />
          <span style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 28,
            color: '#fff',
            background: 'linear-gradient(135deg, #FF4D6D, #FFC0CB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            HeartLink
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: '#fff', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/create" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                Create Proposal
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none',
                color: '#FF4D6D',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
              }}>
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff', fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
