import { motion } from 'framer-motion';
import { Globe, Mail } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../shared/SocialIcons';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const iconMap = {
  Github, GitHub: Github,
  Linkedin, LinkedIn: Linkedin,
  Twitter,
  Globe,
  Mail,
};

const SocialLinks = () => {
  const { data: links } = useSupabaseData('social_links', {
    orderBy: 'display_order',
  });

  const socialLinks = links?.length > 0
    ? links
    : [
        { id: '1', platform: 'GitHub', url: '#', icon_name: 'Github' },
        { id: '2', platform: 'LinkedIn', url: '#', icon_name: 'Linkedin' },
      ];

  return (
    <section className="py-12 bg-canvas/20">
      <div className="container-custom px-4">
        <div className="flex items-center justify-center gap-6">
          {socialLinks.map((link, i) => {
            const Icon = iconMap[link.icon_name] || Globe;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.1 }}
                className="group relative w-12 h-12 rounded-2xl bg-silk border border-canvas/50
                         flex items-center justify-center text-timber
                         hover:bg-ember hover:text-silk hover:border-ember hover:shadow-warm-md
                         transition-all duration-300"
                aria-label={link.platform}
              >
                <Icon size={20} />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-body text-timber
                             opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {link.platform}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
