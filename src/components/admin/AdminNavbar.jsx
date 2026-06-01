import { Menu, Home, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ toggleSidebar, title = 'Dashboard' }) => {
  return (
    <header className="h-16 bg-silk border-b border-canvas/30 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-timber hover:bg-canvas/30 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-display font-bold text-cocoa">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-body font-medium text-timber hover:bg-canvas/30 transition-colors"
        >
          <ExternalLink size={16} />
          View Site
        </Link>
        <Link
          to="/"
          className="sm:hidden p-2 rounded-lg text-timber hover:bg-canvas/30 transition-colors"
          aria-label="View Site"
        >
          <Home size={20} />
        </Link>

        {/* User avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-ember/20 text-ember flex items-center justify-center font-display font-bold text-sm ml-2 border border-ember/30">
          AK
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
