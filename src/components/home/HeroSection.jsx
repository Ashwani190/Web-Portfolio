import { useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const prefersReducedMotion = useReducedMotion();

  // ── Mouse tracking for 3D tilt ──
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 40, damping: 25, mass: 1.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  // Parallax offsets for different depth layers
  const fgParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [12, -12]), springConfig);
  const fgParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const bgParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [24, -24]), springConfig);
  const bgParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [24, -24]), springConfig);

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

  // Split the name into words for staggered animation
  const nameWords = useMemo(() => name.split(' '), [name]);

  return (
    <section
      ref={containerRef}
      className="hero-float-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background blurred text layer (deepest depth) ── */}
      <motion.div
        className="hero-bg-text-layer"
        style={{
          x: prefersReducedMotion ? 0 : bgParallaxX,
          y: prefersReducedMotion ? 0 : bgParallaxY,
        }}
        aria-hidden="true"
      >
        <span className={`hero-bg-text ${prefersReducedMotion ? '' : 'hero-float-bg'}`}>
          {name}
        </span>
      </motion.div>

      {/* ── Second ghost text layer (mid depth) ── */}
      <motion.div
        className="hero-bg-text-layer hero-bg-text-layer--mid"
        style={{
          x: prefersReducedMotion ? 0 : fgParallaxX,
          y: prefersReducedMotion ? 0 : fgParallaxY,
        }}
        aria-hidden="true"
      >
        <span className={`hero-bg-text hero-bg-text--mid ${prefersReducedMotion ? '' : 'hero-float-mid'}`}>
          {name}
        </span>
      </motion.div>

      {/* ── Ambient glow orbs ── */}
      <div className={`hero-glow-orb hero-glow-orb--primary ${prefersReducedMotion ? '' : 'hero-glow-pulse'}`} aria-hidden="true" />
      <div className={`hero-glow-orb hero-glow-orb--secondary ${prefersReducedMotion ? '' : 'hero-glow-pulse-alt'}`} aria-hidden="true" />

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
        className="hero-content-wrapper container-custom px-4 sm:px-6 lg:px-8"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
        }}
      >
        <div className="max-w-4xl mx-auto text-center hero-content-inner">
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4 hero-depth-layer-1"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas/30 border border-canvas/50 text-timber font-body text-sm">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* ── FLOATING HEADLINE ── */}
          <div className={`hero-headline-float ${prefersReducedMotion ? '' : 'hero-float-main'}`}>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-cocoa mb-6 leading-[0.95]"
            >
              {/* "Hello, I'm" floats together */}
              <motion.span
                className="inline-block hero-depth-layer-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Hello, I'm{' '}
              </motion.span>

              {/* Each name word floats independently at different speeds */}
              {nameWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  className={`inline-block hero-word-float ${
                    idx === nameWords.length - 1 ? 'text-gradient' : ''
                  } ${prefersReducedMotion ? '' : `hero-float-word-${(idx % 3) + 1}`}`}
                  initial={{ opacity: 0, y: 60 + idx * 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.6 + idx * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{ position: 'relative' }}
                >
                  {word}
                  {idx < nameWords.length - 1 ? '\u00A0' : ''}
                  {/* Underline on last word */}
                  {idx === nameWords.length - 1 && (
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-ember to-burlap rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-8 hero-depth-layer-1"
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
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-timber font-body text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed hero-depth-layer-1"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-depth-layer-1"
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
