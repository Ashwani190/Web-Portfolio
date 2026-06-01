import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ aboutData }) => {
  const name = aboutData?.name || 'Ashwani Kumar';
  const resumeUrl = aboutData?.resume_url;
  
  const rawRoles = aboutData?.hero_roles || 'Full Stack Developer, UI/UX Designer, Open Source Contributor, Software Architect';
  // Parse comma separated string into array, intercalating with 2000 delay for TypeAnimation
  const sequence = rawRoles.split(',').map(role => role.trim()).flatMap(role => [role, 2000]);
  
  const description = aboutData?.hero_description || 'I craft beautiful, performant web applications with modern technologies. Passionate about clean code, great design, and solving complex problems.';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          animate={{
            y: [0, -25 + i * 5, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Decorative grid dots */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #360800 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-canvas/30 border border-canvas/50 text-timber font-body text-sm">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-cocoa mb-6 leading-[0.95]"
          >
            Hello, I'm{' '}
            <span className="text-gradient relative">
              {name}
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-ember to-burlap rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
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
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
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
      </div>

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
