import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaGamepad,
  FaGift,
  FaHeart,
  FaLock,
  FaMusic,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: "absolute",
            left: `${heart.left}%`,
            bottom: -50,
            fontSize: heart.size,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.5, 0],
            x: [0, Math.sin(heart.id) * 50, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

const Landing = () => {
  const features = [
    {
      icon: <FaHeart />,
      title: "Personalized Messages",
      desc: "Write from the heart with custom love messages",
    },
    {
      icon: <FaLock />,
      title: "Private Gallery",
      desc: "Password-protected memories only you two can see",
    },
    {
      icon: <FaMusic />,
      title: "Romantic Music",
      desc: "Set the mood with your special song",
    },
    {
      icon: <FaGamepad />,
      title: "Love Games",
      desc: "Interactive brick breaker with a romantic twist",
    },
    {
      icon: <FaGift />,
      title: "Surprise Gifts",
      desc: "Mystery gift boxes filled with love",
    },
  ];

  return (
    <div
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      <FloatingHearts />

      {/* Hero Section */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 80, marginBottom: 20 }}
          >
            💕
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(48px, 8vw, 96px)",
            background: "linear-gradient(135deg, #FF4D6D, #FFC0CB, #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 20,
          }}
        >
          HeartLink
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: "clamp(18px, 2.5vw, 28px)",
            color: "#FFC0CB",
            fontFamily: "'Dancing Script', cursive",
            marginBottom: 40,
            maxWidth: 600,
          }}
        >
          Create a magical proposal experience for your special someone
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/register"
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              padding: "16px 40px",
            }}
          >
            Start Your Journey <FaArrowRight />
          </Link>
          <Link
            to="/login"
            className="btn-secondary"
            style={{ fontSize: 18, padding: "16px 40px" }}
          >
            I Have a Link
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontFamily: "'Great Vibes', cursive",
            marginBottom: 60,
            color: "#FFC0CB",
          }}
        >
          Make It Unforgettable ❤️
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 30,
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass"
              style={{
                padding: 40,
                textAlign: "center",
                cursor: "default",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  color: "#FF4D6D",
                  marginBottom: 20,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontFamily: "'Dancing Script', cursive",
                  marginBottom: 12,
                  color: "#FFC0CB",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#ccc", lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontFamily: "'Great Vibes', cursive",
              marginBottom: 20,
              color: "#FFD700",
            }}
          >
            Ready to Create Magic? ✨
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#ccc",
              marginBottom: 40,
              maxWidth: 500,
              margin: "0 auto 40px",
            }}
          >
            Join thousands who have expressed their love in the most creative
            way possible
          </p>
          <Link
            to="/register"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              padding: "16px 40px",
            }}
          >
            Create Your Proposal <FaHeart />
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: 30,
          borderTop: "1px solid rgba(255, 77, 109, 0.2)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{ color: "#666" }}>
          Made with ❤️ by HeartLink | &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Landing;
