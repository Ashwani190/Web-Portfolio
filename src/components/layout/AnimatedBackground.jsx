import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate deterministic particles to avoid hydration mismatches
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    size: 10 + (i % 30) * 4, // 10px to 130px
    x: (i * 17) % 100, // pseudo-random distribution 0-100%
    y: (i * 23) % 100,
    duration: 15 + (i % 15), // 15s to 30s
    delay: (i % 10) * -2,
    opacity: 0.1 + (i % 4) * 0.1, // 0.1 to 0.4
    parallaxRatio: 10 + (i % 20), // 10 to 30 parallax multiplier
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0F1115]">
      {/* ── Base Gradient Transition ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#151920] to-[#1A1D23] opacity-90" />

      {/* ── Ambient Glows ── */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(26,29,35,0.8) 0%, rgba(15,17,21,0) 70%)',
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: mousePosition.x * -30,
          y: mousePosition.y * -30,
          scale: [1, 1.05, 1],
        }}
        transition={{ scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(221,229,235,0.3) 0%, rgba(15,17,21,0) 70%)',
          bottom: '0%',
          right: '-5%',
        }}
        animate={{
          x: mousePosition.x * 40,
          y: mousePosition.y * 40,
          scale: [1, 1.1, 1],
        }}
        transition={{ scale: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
      />

      {/* ── Floating Particles / Bubbles ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(221,229,235,${p.opacity}), rgba(221,229,235,${
              p.opacity * 0.3
            }))`,
            boxShadow: `inset -2px -2px 6px rgba(15,17,21,0.2), 0 0 15px rgba(221,229,235,${p.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -30 - (p.id % 20), 0],
            x: [0, 15 - (p.id % 30), 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        >
          {/* Parallax wrapper driven by mouse */}
          <motion.div
            className="w-full h-full rounded-full"
            animate={{
              x: mousePosition.x * p.parallaxRatio,
              y: mousePosition.y * p.parallaxRatio,
            }}
            transition={{ type: 'spring', stiffness: 40, damping: 20 }}
          />
        </motion.div>
      ))}

      {/* ── Subtle Grain Texture Overlay ── */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedBackground;
