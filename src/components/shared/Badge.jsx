const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-canvas/50 text-timber border-canvas',
    ember: 'bg-ember/10 text-ember border-ember/20',
    cocoa: 'bg-cocoa/10 text-cocoa border-cocoa/20',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
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
