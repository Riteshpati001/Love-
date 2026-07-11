import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { proposalAPI } from '../services/api';
import { FaHeart, FaArrowLeft, FaMusic, FaLock, FaUser, FaEdit } from 'react-icons/fa';

const CreateProposal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receiverName: '',
    title: '',
    introMessage: '',
    proposalMessage: '',
    song: '',
    galleryPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.receiverName || !form.galleryPassword) {
      setError('Receiver name and gallery password are required');
      return;
    }
    if (form.galleryPassword.length < 4) {
      setError('Gallery password must be at least 4 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await proposalAPI.create(form);
      setCreatedLink(data.proposal.link);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(createdLink);
    alert('Link copied to clipboard!');
  };

  if (createdLink) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass"
          style={{ textAlign: 'center', padding: 60, maxWidth: 500, width: '100%' }}
        >
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <FaHeart style={{ fontSize: 60, color: '#FF4D6D', marginBottom: 20 }} />
          </motion.div>
          <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: '#FFC0CB', marginBottom: 15 }}>
            Proposal Created! 🎉
          </h2>
          <p style={{ color: '#ccc', marginBottom: 30 }}>
            Your proposal link is ready. Share it with your loved one!
          </p>
          <div className="glass" style={{ padding: 20, marginBottom: 30, wordBreak: 'break-all' }}>
            <p style={{ color: '#FFC0CB', fontSize: 14, marginBottom: 10 }}>{createdLink}</p>
            <button onClick={copyLink} className="btn-primary" style={{ width: '100%' }}>
              Copy Link
            </button>
          </div>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Go to Dashboard
            </button>
            <button onClick={() => { setCreatedLink(''); setForm({ receiverName: '', title: '', introMessage: '', proposalMessage: '', song: '', galleryPassword: '' }); }} className="btn-primary">
              Create Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', color: '#FFC0CB', display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 30, fontSize: 15, cursor: 'pointer',
          }}>
            <FaArrowLeft /> Back to Dashboard
          </button>

          <h1 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 42, color: '#FFC0CB', marginBottom: 8 }}>
            Create Your Proposal
          </h1>
          <p style={{ color: '#999', marginBottom: 40 }}>
            Fill in the details below to create a magical proposal experience
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 12, padding: 12, marginBottom: 20, color: '#FF4D6D', textAlign: 'center', fontSize: 14,
            }}>
            {error}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass"
          style={{ padding: 40 }}
        >
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              <FaUser /> Receiver's Name <span style={{ color: '#FF4D6D' }}>*</span>
            </label>
            <input type="text" name="receiverName" value={form.receiverName} onChange={handleChange}
              placeholder="Enter your loved one's name"
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15,
              }} />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              <FaEdit /> Proposal Title
            </label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="A Special Message For You ❤️"
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15,
              }} />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              💌 Intro Message (Box 1)
            </label>
            <textarea name="introMessage" value={form.introMessage} onChange={handleChange}
              placeholder="Write a heartfelt introduction message..."
              rows={4}
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, resize: 'vertical',
              }} />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              💍 Proposal Message (Box 2)
            </label>
            <textarea name="proposalMessage" value={form.proposalMessage} onChange={handleChange}
              placeholder="Write your proposal message..."
              rows={4}
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, resize: 'vertical',
              }} />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              <FaMusic /> Song URL (optional)
            </label>
            <input type="text" name="song" value={form.song} onChange={handleChange}
              placeholder="Paste a music URL (YouTube, Spotify, etc.)"
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15,
              }} />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#FFC0CB', fontSize: 15 }}>
              <FaLock /> Gallery Password <span style={{ color: '#FF4D6D' }}>*</span>
            </label>
            <input type="text" name="galleryPassword" value={form.galleryPassword} onChange={handleChange}
              placeholder="Set a password for the private gallery"
              style={{
                width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15,
              }} />
            <p style={{ color: '#666', fontSize: 12, marginTop: 5 }}>Share this password with your loved one to unlock the gallery</p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', fontSize: 16, padding: '16px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : '✨ Create Proposal'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateProposal;
