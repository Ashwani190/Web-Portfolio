import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, User, Code, Folder, 
  Award, GraduationCap, Trophy, FileText, 
  Share2, Megaphone, LogOut, X, Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIsMobile } from '../../hooks/useMediaQuery';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/about', label: 'About Me', icon: User },
  { path: '/admin/skills', label: 'Skills', icon: Code },
  { path: '/admin/projects', label: 'Projects', icon: Folder },
  { path: '/admin/certifications', label: 'Certifications', icon: Award },
  { path: '/admin/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { path: '/admin/social', label: 'Social Links', icon: Share2 },
  { path: '/admin/ticker', label: 'Ticker', icon: Megaphone },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-cocoa text-silk">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-silk/10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-display font-bold">AK Admin</span>
        </div>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-silk/10 rounded-lg text-canvas/70 hover:text-silk transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <nav className="space-y-1.5">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-ember/20 text-ember' 
                  : 'text-canvas/70 hover:bg-silk/5 hover:text-silk'}
              `}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-silk/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium text-canvas/70 hover:bg-silk/5 hover:text-silk transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-cocoa/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <motion.aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] z-50 ${isMobile ? '' : 'lg:translate-x-0'}`}
        initial={isMobile ? { x: '-100%' } : { x: 0 }}
        animate={{ x: isOpen || !isMobile ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
