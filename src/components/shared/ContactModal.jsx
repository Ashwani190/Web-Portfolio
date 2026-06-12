import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowRight } from 'lucide-react';
import { Linkedin } from './SocialIcons';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const ContactModal = ({ isOpen, onClose }) => {
  const { data: aboutData } = useSupabaseData('about', { single: true, orderBy: null });
  const { data: socialLinks } = useSupabaseData('social_links', { orderBy: 'display_order' });

  const email = aboutData?.email;
  const phone = aboutData?.phone_number;
  
  // Find LinkedIn link
  const linkedinLink = socialLinks?.find(link => link.icon_name === 'Linkedin' || link.platform.toLowerCase().includes('linkedin'))?.url;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-cocoa/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-silk rounded-2xl shadow-warm-2xl w-full max-w-md overflow-hidden border border-canvas/40 pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-canvas/30 bg-canvas">
                <h3 className="text-xl font-display font-bold text-cocoa">Let's Connect</h3>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-lg text-canvas/60 hover:text-timber hover:bg-canvas/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-timber font-body text-sm mb-6">
                  I'm currently available for new opportunities. Feel free to reach out via email, phone, or connect with me on LinkedIn.
                </p>

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-canvas/40 bg-white/5 hover:border-ember hover:shadow-warm-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-canvas/30 flex items-center justify-center text-ember group-hover:bg-ember/10">
                      <Mail size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-cocoa text-sm">Email</h4>
                      <p className="text-timber font-body text-sm">{email}</p>
                    </div>
                    <ArrowRight size={16} className="text-canvas/40 group-hover:text-ember transition-colors" />
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-canvas/40 bg-white/5 hover:border-ember hover:shadow-warm-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-canvas/30 flex items-center justify-center text-ember group-hover:bg-ember/10">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-cocoa text-sm">Phone</h4>
                      <p className="text-timber font-body text-sm">{phone}</p>
                    </div>
                    <ArrowRight size={16} className="text-canvas/40 group-hover:text-ember transition-colors" />
                  </a>
                )}

                {linkedinLink && (
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-canvas/40 bg-white/5 hover:border-ember hover:shadow-warm-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-canvas/30 flex items-center justify-center text-ember group-hover:bg-ember/10">
                      <Linkedin size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-cocoa text-sm">LinkedIn</h4>
                      <p className="text-timber font-body text-sm">Connect with me</p>
                    </div>
                    <ArrowRight size={16} className="text-canvas/40 group-hover:text-ember transition-colors" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
