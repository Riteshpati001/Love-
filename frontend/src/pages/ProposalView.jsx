import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { proposalAPI, galleryAPI } from '../services/api';
import { FaHeart, FaPlay, FaLock, FaGift, FaGamepad, FaTimes, FaArrowRight } from 'react-icons/fa';

// ====== BOX 1: Intro Card ======
const IntroCard = ({ proposal, onNext, onPlaySong }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showMessage) {
      const interval = setInterval(() => {
        setHearts(prev => [...prev, { id: Date.now(), x: Math.random() * 100, size: Math.random() * 20 + 10 }]);
      }, 300);
      setTimeout(() => clearInterval(interval), 5000);
      return () => clearInterval(interval);
    }
  }, [showMessage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="glass"
      style={{ maxWidth: 600, width: '100%', padding: 50, textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {hearts.map(h => (
        <motion.div key={h.id} style={{ position: 'absolute', left: `${h.x}%`, top: '50%', fontSize: h.size, pointerEvents: 'none' }}
          animate={{ y: -200, opacity: 0 }} transition={{ duration: 2, ease: 'easeOut' }}>❤️</motion.div>
      ))}

      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 60, marginBottom: 20 }}>
        💕
      </motion.div>

      <AnimatePresence>
        {showMessage && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 32, color: '#FFC0CB', marginBottom: 10 }}>
              Hey, I Want to Tell You Something ❤️
            </h2>
            <p style={{ color: '#ddd', lineHeight: 1.8, fontSize: 16, marginBottom: 30 }}>
              {proposal.introMessage}
            </p>
            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={onPlaySong} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaPlay /> Play Song
              </button>
              <button onClick={onNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Next <FaArrowRight />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ====== BOX 2: Proposal Card ======
const ProposalCard = ({ proposal, onAccept, onReject }) => {
  const [rejectBtnStyle, setRejectBtnStyle] = useState({});
  const rejectRef = useRef(null);
  const containerRef = useRef(null);
  const attemptsRef = useRef(0);

  const handleRejectHover = useCallback(() => {
    attemptsRef.current += 1;
    if (attemptsRef.current < 5) {
      const container = containerRef.current?.getBoundingClientRect();
      if (container) {
        const maxX = container.width - 120;
        const maxY = container.height - 50;
        setRejectBtnStyle({
          position: 'absolute',
          left: `${Math.random() * maxX}px`,
          top: `${Math.random() * maxY}px`,
          transition: 'all 0.2s ease',
        });
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="glass"
      style={{ maxWidth: 600, width: '100%', padding: 50, textAlign: 'center' }}
    >
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 70, marginBottom: 20 }}>
        💍
      </motion.div>
      <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: '#FFC0CB', marginBottom: 20 }}>
        {proposal.title}
      </h2>
      <p style={{ color: '#ddd', lineHeight: 1.8, fontSize: 18, marginBottom: 40, fontFamily: "'Dancing Script', cursive" }}>
        {proposal.proposalMessage}
      </p>
      <div ref={containerRef} style={{ position: 'relative', minHeight: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <button onClick={onAccept} className="btn-primary" style={{ fontSize: 18, padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 10 }}>
          Accept ❤️
        </button>
        <button
          ref={rejectRef}
          onMouseEnter={handleRejectHover}
          onClick={() => { if (attemptsRef.current >= 5) onReject(); }}
          className="btn-secondary"
          style={{ fontSize: 18, padding: '16px 40px', ...rejectBtnStyle }}
        >
          Reject 💔
        </button>
      </div>
    </motion.div>
  );
};

// ====== BOX 3: Gallery ======
const GalleryBox = ({ proposalId }) => {
  const [locked, setLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [gallery, setGallery] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    try {
      const { data } = await galleryAPI.unlock(proposalId, password);
      setGallery(data.gallery);
      setVoiceNotes(data.voiceNotes);
      setLocked(false);
    } catch (err) {
      setError('Incorrect password');
    }
  };

  if (locked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 50, textAlign: 'center' }}>
        <FaLock style={{ fontSize: 50, color: '#FFD700', marginBottom: 20 }} />
        <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: '#FFC0CB', marginBottom: 20 }}>
          Gallery Locked 🔒
        </h3>
        <p style={{ color: '#999', marginBottom: 20 }}>Enter the password to unlock private memories</p>
        <div style={{ display: 'flex', gap: 10, maxWidth: 350, margin: '0 auto' }}>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter password"
            style={{
              flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15,
            }} />
          <button onClick={handleUnlock} className="btn-primary" style={{ padding: '14px 24px' }}>Unlock</button>
        </div>
        {error && <p style={{ color: '#FF4D6D', marginTop: 10, fontSize: 14 }}>{error}</p>}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 40 }}>
      <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: '#FFC0CB', marginBottom: 20, textAlign: 'center' }}>
        Our Memories ❤️
      </h3>
      {gallery.length === 0 && voiceNotes.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center' }}>No memories have been added yet.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 15, marginBottom: 20 }}>
            {gallery.map((item) => (
              <div key={item._id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '1' }}>
                {item.type === 'video' ? (
                  <video src={item.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={item.url} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
          {voiceNotes.length > 0 && (
            <div>
              <h4 style={{ color: '#FFC0CB', marginBottom: 10 }}>Voice Notes 🎵</h4>
              {voiceNotes.map((note) => (
                <audio key={note._id} src={note.audioURL} controls style={{ width: '100%', marginBottom: 10 }} />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

// ====== BOX 4: Brick Breaker Game ======
const BrickGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [letters, setLetters] = useState([]);
  const [caughtLetters, setCaughtLetters] = useState([]);
  const gameRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setWon(false);
    setLetters([]);
    setCaughtLetters([]);
    initGame();
  };

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 400;

    const bricks = [];
    const rows = 5;
    const cols = 7;
    const brickW = 60;
    const brickH = 20;
    const padding = 10;
    const lettersArr = ['I', ' ', 'L', 'O', 'V', 'E', ' ', 'Y', 'O', 'U', ' ', '❤️'];
    let letterIdx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (letterIdx < lettersArr.length) {
          bricks.push({
            x: c * (brickW + padding) + 30,
            y: r * (brickH + padding) + 30,
            w: brickW,
            h: brickH,
            letter: lettersArr[letterIdx],
            alive: true,
          });
          letterIdx++;
        }
      }
    }

    let ball = { x: 250, y: 350, dx: 3, dy: -3, radius: 8 };
    let paddle = { x: 200, y: 370, w: 100, h: 12 };
    let mouseX = 250;

    const animate = () => {
      if (gameRef.current !== 'playing') return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      let allDead = true;
      bricks.forEach(b => {
        if (b.alive) {
          allDead = false;
          ctx.fillStyle = '#FF4D6D';
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.w, b.h, 5);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(b.letter, b.x + b.w / 2, b.y + b.h / 2 + 5);
        }
      });

      // Ball
      paddle.x = mouseX - paddle.w / 2;
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
      if (ball.y < 0) ball.dy *= -1;

      if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        ball.dy *= -1;
      }

      if (ball.y > canvas.height) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('lost');
            gameRef.current = 'lost';
          }
          return newLives;
        });
        ball = { x: 250, y: 350, dx: 3, dy: -3, radius: 8 };
      }

      // Collision with bricks
      bricks.forEach(b => {
        if (b.alive && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
          b.alive = false;
          ball.dy *= -1;
          setScore(prev => prev + 10);
          setLetters(prev => [...prev, { letter: b.letter, x: b.x + b.w / 2, y: 0 }]);
        }
      });

      // Draw paddle
      ctx.fillStyle = '#FFC0CB';
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
      ctx.fill();

      // Draw ball
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      if (allDead) {
        setWon(true);
        setGameState('won');
        gameRef.current = 'won';
        return;
      }

      requestAnimationFrame(animate);
    };

    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    };

    gameRef.current = 'playing';
    animate();
  };

  if (gameState === 'idle' || gameState === 'lost') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 50, textAlign: 'center' }}>
        <FaGamepad style={{ fontSize: 50, color: '#FF4D6D', marginBottom: 20 }} />
        <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: '#FFC0CB', marginBottom: 15 }}>
          Love Brick Game ❤️
        </h3>
        {gameState === 'lost' ? (
          <p style={{ color: '#FF4D6D', marginBottom: 20 }}>Sorry, Try Again ❤️</p>
        ) : (
          <p style={{ color: '#ccc', marginBottom: 20 }}>Break the bricks to reveal a special message!</p>
        )}
        <button onClick={startGame} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <FaGamepad /> {gameState === 'lost' ? 'Play Again' : 'Start Game'}
        </button>
      </motion.div>
    );
  }

  if (gameState === 'won') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 50, textAlign: 'center' }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: 60, marginBottom: 20 }}>
          🎉
        </motion.div>
        <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: '#FFD700', marginBottom: 15 }}>
          I LOVE YOU ❤️
        </h3>
        <p style={{ color: '#ccc', marginBottom: 20 }}>You caught all the letters! Amazing! 🎊</p>
        <button onClick={startGame} className="btn-primary">Play Again</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 30, textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: '#FFC0CB', marginBottom: 15 }}>
        Love Brick Game ❤️
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#ccc' }}>
        <span>Score: {score}</span>
        <span>Lives: {'❤️'.repeat(lives)}</span>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 500, borderRadius: 12, background: 'rgba(0,0,0,0.3)' }} />
    </motion.div>
  );
};

// ====== BOX 5: Mystery Gift Boxes ======
const MysteryBoxes = () => {
  const rewards = [
    { emoji: '🧸', text: 'Teddy Bear' },
    { emoji: '🌹', text: 'Roses' },
    { emoji: '💖', text: 'Heart Rain' },
    { emoji: '💌', text: 'Romantic Shayari' },
    { emoji: '✨', text: 'Love Quotes' },
    { emoji: '🍫', text: 'Virtual Chocolate' },
    { emoji: '🎆', text: 'Fireworks' },
    { emoji: '🤗', text: 'Hug Animation' },
    { emoji: '💋', text: 'Kiss Animation' },
    { emoji: '😍', text: 'Cute GIF' },
  ];

  const [opened, setOpened] = useState({});
  const [currentReward, setCurrentReward] = useState(null);

  const openBox = (index) => {
    if (opened[index]) return;
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setOpened(prev => ({ ...prev, [index]: true }));
    setCurrentReward(reward);
    setTimeout(() => setCurrentReward(null), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ maxWidth: 600, width: '100%', padding: 40, textAlign: 'center' }}>
      <FaGift style={{ fontSize: 40, color: '#FFD700', marginBottom: 15 }} />
      <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, color: '#FFC0CB', marginBottom: 20 }}>
        Mystery Gift Boxes 🎁
      </h3>
      <p style={{ color: '#ccc', marginBottom: 25 }}>Click a box to reveal a surprise!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 15, marginBottom: 20 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openBox(i)}
            style={{
              aspectRatio: '1', borderRadius: 16, fontSize: 32,
              background: opened[i] ? 'rgba(255,77,109,0.2)' : 'linear-gradient(135deg, #FF4D6D, #FFC0CB)',
              border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {opened[i] ? '🎁' : '❓'}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {currentReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="glass"
            style={{ padding: 20, marginTop: 10 }}
          >
            <div style={{ fontSize: 50, marginBottom: 10 }}>{currentReward.emoji}</div>
            <p style={{ color: '#FFD700', fontSize: 18, fontFamily: "'Dancing Script', cursive" }}>
              {currentReward.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ====== BOX 6: Final Screen ======
const FinalScreen = ({ response }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="glass"
      style={{ maxWidth: 600, width: '100%', padding: 60, textAlign: 'center' }}
    >
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 80, marginBottom: 20 }}>
        {response === 'accepted' ? '💍' : '💔'}
      </motion.div>
      <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 42, color: '#FFC0CB', marginBottom: 15 }}>
        Thank You For Visiting ❤️
      </h2>
      {response === 'accepted' ? (
        <p style={{ color: '#FFD700', fontSize: 20, fontFamily: "'Dancing Script', cursive" }}>
          Your love story begins here. 💕
        </p>
      ) : response === 'rejected' ? (
        <p style={{ color: '#ccc', fontSize: 18 }}>
          Thank you for your honesty.
        </p>
      ) : (
        <p style={{ color: '#ccc', fontSize: 18 }}>
          The journey awaits...
        </p>
      )}
    </motion.div>
  );
};

// ====== MAIN PROPOSAL VIEW ======
const ProposalView = () => {
  const { link } = useParams();
  const [proposal, setProposal] = useState(null);
  const [response, setResponse] = useState(null);
  const [currentBox, setCurrentBox] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [link]);

  const fetchProposal = async () => {
    try {
      const { data } = await proposalAPI.getByLink(link);
      setProposal(data.proposal);
      setResponse(data.response);
    } catch (err) {
      setError(err.response?.data?.message || 'Proposal not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await proposalAPI.respond(link, 'accepted');
      setResponse({ status: 'accepted' });
      setShowConfetti(true);
      setTimeout(() => setCurrentBox(5), 2000);
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  const handleReject = async () => {
    try {
      await proposalAPI.respond(link, 'rejected');
      setResponse({ status: 'rejected' });
      setCurrentBox(5);
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  const handlePlaySong = () => {
    setMusicPlaying(!musicPlaying);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <FaHeart style={{ fontSize: 60, color: '#FF4D6D' }} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="glass" style={{ textAlign: 'center', padding: 60, maxWidth: 500 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>😢</div>
          <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 32, color: '#FFC0CB', marginBottom: 15 }}>
            Oops!
          </h2>
          <p style={{ color: '#ccc', marginBottom: 20 }}>{error}</p>
          <a href="/" className="btn-primary" style={{ display: 'inline-block' }}>Go Home</a>
        </div>
      </div>
    );
  }

  const boxes = [
    { id: 'intro', component: <IntroCard proposal={proposal} onNext={() => setCurrentBox(1)} onPlaySong={handlePlaySong} /> },
    { id: 'proposal', component: <ProposalCard proposal={proposal} onAccept={handleAccept} onReject={handleReject} /> },
    { id: 'gallery', component: <GalleryBox proposalId={proposal.id} /> },
    { id: 'game', component: <BrickGame /> },
    { id: 'gifts', component: <MysteryBoxes /> },
    { id: 'final', component: <FinalScreen response={response?.status} /> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Confetti effect */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100 }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, rotate: 0 }}
              animate={{ y: window.innerHeight + 20, rotate: 720 }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
              style={{
                position: 'absolute', fontSize: 20,
                color: ['#FF4D6D', '#FFC0CB', '#FFD700', '#E6E6FA', '#fff'][Math.floor(Math.random() * 5)],
              }}
            >
              {['🎉', '🎊', '❤️', '💕', '✨', '🌟'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {boxes.map((_, i) => (
          <button key={i} onClick={() => setCurrentBox(i)}
            style={{
              width: 12, height: 12, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: i === currentBox ? '#FF4D6D' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            }} />
        ))}
      </div>

      {/* Current box */}
      <AnimatePresence mode="wait">
        <motion.div key={currentBox} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {boxes[currentBox].component}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
        {currentBox > 0 && (
          <button onClick={() => setCurrentBox(prev => prev - 1)} className="btn-secondary" style={{ padding: '12px 24px' }}>
            ← Previous
          </button>
        )}
        {currentBox < boxes.length - 1 && currentBox !== 1 && (
          <button onClick={() => setCurrentBox(prev => prev + 1)} className="btn-primary" style={{ padding: '12px 24px' }}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalView;
