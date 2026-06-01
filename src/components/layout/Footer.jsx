import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../shared/SocialIcons';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const iconMap = {
  Github, GitHub: Github,
  Linkedin, LinkedIn: Linkedin,
  Twitter,
};

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/certifications', label: 'Certifications' },
  { path: '/education', label: 'Education' },
  { path: '/achievements', label: 'Achievements' },
];

const Footer = () => {
  const { data: socialLinks } = useSupabaseData('social_links', {
    orderBy: 'display_order',
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cocoa text-silk relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-ember via-burlap to-ember" />

      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold text-silk mb-3">AK</h3>
            <p className="text-canvas/80 font-body text-sm leading-relaxed max-w-xs">
              Full-Stack Developer crafting beautiful, functional web experiences with
              modern technologies and a passion for clean code.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-body font-semibold uppercase tracking-wider text-burlap mb-4">
              Quick Links
            </h4>
            <nav className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-canvas/70 hover:text-silk text-sm font-body transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-body font-semibold uppercase tracking-wider text-burlap mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks?.map((link) => {
                const Icon = iconMap[link.icon_name] || Github;
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 rounded-xl bg-silk/10 flex items-center justify-center
                             text-canvas/70 hover:text-silk hover:bg-ember/80 transition-all duration-300"
                    aria-label={link.platform}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
              {(!socialLinks || socialLinks.length === 0) && (
                <>
                  <a href="#" className="w-10 h-10 rounded-xl bg-silk/10 flex items-center justify-center text-canvas/70 hover:text-silk hover:bg-ember/80 transition-all duration-300">
                    <Github size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-silk/10 flex items-center justify-center text-canvas/70 hover:text-silk hover:bg-ember/80 transition-all duration-300">
                    <Linkedin size={18} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-silk/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-canvas/50 text-sm font-body">
            © {currentYear} All rights reserved. Made with{' '}
            <Heart size={14} className="inline text-ember" fill="currentColor" /> and lots of coffee.
          </p>

          {/* Scroll to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-silk/10 flex items-center justify-center
                     text-canvas/70 hover:text-silk hover:bg-ember/80 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ember/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </footer>
  );
};

export default Footer;
