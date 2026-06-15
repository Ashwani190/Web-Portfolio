import { useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  // ── Mouse tracking for interactive tilt ──
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very soft springs for organic feel
  const springConfig = { stiffness: 35, damping: 30, mass: 1.8 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  // Parallax offsets — bg moves more than fg for depth
  const bgParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig);
  const bgParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const midParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [8, -8]), springConfig);
  const midParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY, prefersReducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Split name into words for layered parallax
  const nameWords = useMemo(() => name.split(' '), [name]);

  // CSS class helper — only apply float classes when motion is allowed
  const f = (cls) => (prefersReducedMotion ? '' : cls);

  return (
    <section
      ref={containerRef}
      className="hero-float-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background ghost text (deepest layer) ── */}
      <motion.div
        className="hero-bg-layer"
        style={{
          x: prefersReducedMotion ? 0 : bgParallaxX,
          y: prefersReducedMotion ? 0 : bgParallaxY,
        }}
        aria-hidden="true"
      >
        <span className={`hero-bg-text ${f('hero-drift-slow')}`}>{name}</span>
      </motion.div>

      {/* ── Mid-depth ghost text ── */}
      <motion.div
        className="hero-bg-layer hero-bg-layer--mid"
        style={{
          x: prefersReducedMotion ? 0 : midParallaxX,
          y: prefersReducedMotion ? 0 : midParallaxY,
        }}
        aria-hidden="true"
      >
        <span className={`hero-bg-text hero-bg-text--mid ${f('hero-drift-med')}`}>{name}</span>
      </motion.div>

      {/* ── Ambient glow ── */}
      <div className={`hero-glow hero-glow--primary ${f('hero-glow-breathe')}`} aria-hidden="true" />
      <div className={`hero-glow hero-glow--secondary ${f('hero-glow-breathe-alt')}`} aria-hidden="true" />

      {/* ── Decorative floating circles ── */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-[0.07] bg-canvas ${f(`hero-drift-circle-${(i % 3) + 1}`)}`}
          style={{
            width: 80 + i * 70,
            height: 80 + i * 70,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 16}%`,
          }}
        />
      ))}

      {/* ── Grid dots ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #5B88B2 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Content (mouse-tilt wrapper) ── */}
      <motion.div
        className="hero-content-wrap container-custom px-4 sm:px-6 lg:px-8"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
        }}
      >
        <div className="max-w-4xl mx-auto text-center hero-inner">
          {/* ── Status badge ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas/30 border border-canvas/50 text-timber font-body text-sm">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* ══════════════════════════════════════════════════════
               FLOATING HEADLINE — the main event
               Each word has its own sine-wave float cycle
              ══════════════════════════════════════════════════════ */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-cocoa mb-6 leading-[0.95]"
          >
            {/* "Hello, I'm" — floats on cycle A */}
            <motion.span
              className={`inline-block ${f('hero-drift-a')}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Hello, I'm{' '}
            </motion.span>

            {/* Each name word — floats on staggered cycles */}
            {nameWords.map((word, idx) => {
              // Cycle through 3 different float animations
              const floatClass = [`hero-drift-b`, `hero-drift-c`, `hero-drift-d`][idx % 3];
              const isLast = idx === nameWords.length - 1;

              return (
                <motion.span
                  key={idx}
                  className={`inline-block ${isLast ? 'text-gradient' : ''} ${f(floatClass)}`}
                  initial={{ opacity: 0, y: 50 + idx * 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.55 + idx * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{ position: 'relative' }}
                >
                  {word}
                  {!isLast && '\u00A0'}
                  {isLast && (
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-ember to-burlap rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </motion.span>
              );
            })}
          </motion.h1>

          {/* ── Typewriter roles ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className={`mb-8 ${f('hero-drift-e')}`}
          >
            <TypeAnimation
              sequence={sequence}
              speed={50}
              repeat={Infinity}
              className="text-xl sm:text-2xl lg:text-3xl text-ember font-body font-semibold"
            />
          </motion.div>

          {/* ── Description ── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-timber font-body text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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

      {/* ── Scroll indicator ── */}
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
