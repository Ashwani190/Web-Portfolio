import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Floating animation configs ────────────────────────────────────────────────

const FLOAT_MAIN = {
  y: [0, -12, 0, 8, 0],
  scale: [1, 1.012, 1, 0.992, 1],
  transition: {
    duration: 10,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const FLOAT_KEYWORD = {
  y: [0, -8, 0, 6, 0],
  scale: [1, 1.008, 1, 0.995, 1],
  transition: {
    duration: 12,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const FLOAT_BG_LAYER = {
  y: [0, -18, 0, 14, 0],
  x: [0, 6, 0, -6, 0],
  scale: [1, 1.02, 1, 0.985, 1],
  transition: {
    duration: 14,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const GLOW_PULSE = {
  opacity: [0.25, 0.45, 0.25],
  scale: [1, 1.08, 1],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

const HeroSection = ({ aboutData }) => {
  const name = aboutData?.name || 'Ashwani Kumar';
  const resumeUrl = aboutData?.resume_url;

  const rawRoles =
    aboutData?.hero_roles ||
    'Full Stack Developer, UI/UX Designer, Open Source Contributor, Software Architect';
  const sequence = rawRoles
    .split(',')
    .map((role) => role.trim())
    .flatMap((role) => [role, 2000]);

  const description =
    aboutData?.hero_description ||
    'I craft beautiful, performant web applications with modern technologies. Passionate about clean code, great design, and solving complex problems.';

  // ── Reduced motion ──
  const prefersReducedMotion = useReducedMotion();

  // ── Mouse tracking for 3D tilt ──
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed rotations (subtle: ±3°)
  const springConfig = { stiffness: 60, damping: 30, mass: 1.2 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  // Parallax offsets for layers
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [8, -8]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const bgParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [16, -16]), springConfig);
  const bgParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, prefersReducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // ── Static values when reduced motion is on ──
  const mainFloat = prefersReducedMotion ? {} : FLOAT_MAIN;
  const keywordFloat = prefersReducedMotion ? {} : FLOAT_KEYWORD;
  const bgLayerFloat = prefersReducedMotion ? {} : FLOAT_BG_LAYER;
  const glowAnimate = prefersReducedMotion ? { opacity: 0.3 } : GLOW_PULSE;

  // Split name: last word = highlighted keyword, rest = main heading
  const nameParts = name.split(' ');
  const keyword = nameParts.length > 1 ? nameParts.pop() : '';
  const mainName = nameParts.join(' ');

  return (
    <section
      ref={containerRef}
      className="hero-section-float relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      {/* ── Background blurred text layer (deepest) ── */}
      <motion.div
        className="hero-bg-text-layer"
        animate={bgLayerFloat}
        style={{
          x: prefersReducedMotion ? 0 : bgParallaxX,
          y: prefersReducedMotion ? 0 : bgParallaxY,
          translateZ: -120,
        }}
        aria-hidden="true"
      >
        <span className="hero-bg-text">{name}</span>
      </motion.div>

      {/* ── Ambient glow (behind text) ── */}
      <motion.div
        className="hero-ambient-glow"
        animate={glowAnimate}
        aria-hidden="true"
      />
      <motion.div
        className="hero-ambient-glow hero-ambient-glow--secondary"
        animate={{
          ...(prefersReducedMotion
            ? { opacity: 0.15 }
            : {
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.12, 1],
                transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
              }),
        }}
        aria-hidden="true"
      />

      {/* Floating Background Shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.07] bg-canvas"
          style={{
            width: 80 + i * 70,
            height: 80 + i * 70,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 16}%`,
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, -25 + i * 5, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.05, 1],
                }
          }
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Decorative grid dots */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #5B88B2 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Content (3D-tilting wrapper) ── */}
      <motion.div
        className="container-custom px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="max-w-4xl mx-auto text-center" style={{ transformStyle: 'preserve-3d' }}>
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
            style={{ translateZ: 20 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas/30 border border-canvas/50 text-timber font-body text-sm">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* ── Floating Name (Main layer) ── */}
          <motion.div
            animate={mainFloat}
            style={{
              translateZ: 40,
              x: prefersReducedMotion ? 0 : parallaxX,
              y: prefersReducedMotion ? 0 : parallaxY,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hero-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-cocoa mb-6 leading-[0.95]"
            >
              Hello, I'm{' '}
              {keyword ? (
                <>
                  {mainName}{' '}
                  {/* ── Keyword floating on its own slower cycle ── */}
                  <motion.span
                    className="text-gradient relative inline-block"
                    animate={keywordFloat}
                    style={{ translateZ: 60 }}
                  >
                    {keyword}
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-ember to-burlap rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    />
                  </motion.span>
                </>
              ) : (
                <span className="text-gradient relative">
                  {name}
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-ember to-burlap rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </span>
              )}
            </motion.h1>
          </motion.div>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
            style={{ translateZ: 10 }}
          >
            <TypeAnimation
              sequence={sequence}
              speed={50}
              repeat={Infinity}
              className="text-xl sm:text-2xl lg:text-3xl text-ember font-body font-semibold"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-timber font-body text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ translateZ: 5 }}
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ translateZ: 15 }}
          >
            <Link to="/projects" className="btn-primary text-base px-8 py-4">
              View My Work
              <ArrowRight size={18} />
            </Link>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base px-8 py-4"
              >
                Download Resume
                <Download size={18} />
              </a>
            ) : (
              <button className="btn-outline text-base px-8 py-4">
                Download Resume
                <Download size={18} />
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-burlap" size={28} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
