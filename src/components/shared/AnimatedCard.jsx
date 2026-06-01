import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = '', delay = 0, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hover
          ? { y: -6, boxShadow: '0 20px 40px rgba(54,8,0,0.15)' }
          : {}
      }
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
