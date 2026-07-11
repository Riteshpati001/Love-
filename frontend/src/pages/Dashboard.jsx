import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { proposalAPI } from '../services/api';
import { FaHeart, FaPlus, FaLink, FaTrash, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data } = await proposalAPI.getMy();
      setProposals(data.proposals);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    try {
      await proposalAPI.delete(id);
      setProposals(proposals.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const copyLink = (link) => {
    const url = `${window.location.origin}/p/${link}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <FaHeart style={{ fontSize: 50, color: '#FF4D6D' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}
        >
          <div>
            <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 42, color: '#FFC0CB' }}>
              My Proposals
            </h1>
            <p style={{ color: '#999', marginTop: 5 }}>Welcome back, {user?.name} ❤️</p>
          </div>
          <Link to="/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaPlus /> New Proposal
          </Link>
        </motion.div>

        {proposals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ textAlign: 'center', padding: 80 }}
          >
            <FaHeart style={{ fontSize: 60, color: '#FF4D6D', marginBottom: 20 }} />
            <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: '#FFC0CB', marginBottom: 15 }}>
              No Proposals Yet
            </h2>
            <p style={{ color: '#999', marginBottom: 30, maxWidth: 400, margin: '0 auto 30px' }}>
              Create your first proposal and make someone's day unforgettable!
            </p>
            <Link to="/create" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <FaPlus /> Create Your First Proposal
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass"
                style={{ padding: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: '#FFC0CB', marginBottom: 5 }}>
                    To: {proposal.receiverName}
                  </h3>
                  <p style={{ color: '#999', fontSize: 14 }}>{proposal.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 10 }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 13,
                      color: proposal.status === 'accepted' ? '#4CAF50' : proposal.status === 'rejected' ? '#FF4D6D' : '#FFD700',
                    }}>
                      {proposal.status === 'accepted' ? <FaCheck /> : proposal.status === 'rejected' ? <FaTimes /> : <FaClock />}
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                    {proposal.response && (
                      <span style={{ color: '#999', fontSize: 13 }}>
                        Responded: {new Date(proposal.response.respondedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={() => copyLink(proposal.uniqueLink)} className="btn-secondary" style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FaLink /> Copy Link
                  </button>
                  <button onClick={() => handleDelete(proposal._id)} style={{
                    padding: '10px 20px', fontSize: 13, background: 'rgba(255,77,109,0.1)',
                    border: '1px solid rgba(255,77,109,0.3)', borderRadius: 50, color: '#FF4D6D',
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  }}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
