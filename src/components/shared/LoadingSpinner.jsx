import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, text = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 rounded-full border-[3px] border-canvas"
          style={{ borderTopColor: '#80370c' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-[3px] border-transparent"
          style={{ borderBottomColor: '#bc9d71' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-timber font-body text-sm animate-pulse">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-silk flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
};

export default LoadingSpinner;
