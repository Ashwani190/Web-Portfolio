const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-canvas/50 text-timber border-canvas',
    ember: 'bg-ember/10 text-ember border-ember/20',
    cocoa: 'bg-cocoa/10 text-cocoa border-cocoa/20',
    success: 'bg-green-900/30 text-green-400 border-green-700',
    warning: 'bg-amber-900/30 text-amber-400 border-amber-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
