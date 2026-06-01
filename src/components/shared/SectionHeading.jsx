import { motion } from 'framer-motion';
import { fadeInUp, defaultTransition } from '../../hooks/useScrollAnimation';

const SectionHeading = ({ title, subtitle, centered = true, light = false }) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      transition={defaultTransition}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2
        className={`font-display font-bold mb-3 ${
          light ? 'text-silk' : 'text-cocoa'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg font-body max-w-2xl ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-canvas/80' : 'text-timber'}`}
        >
          {subtitle}
        </p>
      )}
      {/* Decorative underline */}
      <div className={`mt-4 flex items-center gap-2 ${centered ? 'justify-center' : ''}`}>
        <span className={`h-1 w-12 rounded-full ${light ? 'bg-ember' : 'bg-ember'}`} />
        <span className={`h-1 w-3 rounded-full ${light ? 'bg-canvas/40' : 'bg-burlap/60'}`} />
        <span className={`h-1 w-1.5 rounded-full ${light ? 'bg-canvas/30' : 'bg-burlap/40'}`} />
      </div>
    </motion.div>
  );
};

export default SectionHeading;
